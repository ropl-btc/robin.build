"use client";

import { cn } from "@/lib/utils";

interface CalculatorAppProps {
  className?: string;
}

type Op = "+" | "-" | "*" | "/" | null;

export function CalculatorApp({ className }: CalculatorAppProps) {
  const state = useCalculator();

  const key = (
    label: string,
    opts?: { variant?: "op" | "util"; span?: number; onClick?: () => void },
  ) => (
    <button
      type="button"
      key={label}
      onClick={opts?.onClick}
      className={cn(
        "grid place-items-center rounded-full text-lg font-medium shadow-sm",
        "bg-secondary/60 hover:bg-secondary transition-colors w-full",
        opts?.span ? "h-full" : "aspect-square",
        opts?.variant === "op" &&
          "bg-primary/20 text-primary hover:bg-primary/25",
        opts?.variant === "util" &&
          "bg-muted/60 text-muted-foreground hover:bg-muted/70",
        opts?.span === 2 && "col-span-2",
        opts?.span === 3 && "col-span-3",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Display */}
      <div className="flex items-end justify-end px-5 pt-6 pb-4 min-h-28 sm:min-h-32">
        <div className="text-right">
          <div className="text-xs text-muted-foreground h-4">
            {state.prev !== null && state.op
              ? `${state.prev} ${state.op}`
              : "\u00A0"}
          </div>
          <div className="text-5xl sm:text-6xl font-semibold tabular-nums leading-none">
            {state.display}
          </div>
        </div>
      </div>

      {/* Keys */}
      <div className="grid grid-cols-4 gap-3 p-4 pb-6">
        {key("AC", { variant: "util", onClick: state.clear })}
        {key("DEL", { variant: "util", onClick: state.backspace })}
        {key("±", { variant: "util", onClick: state.toggleSign })}
        {key("÷", { variant: "op", onClick: () => state.setOp("/") })}

        {key("7", { onClick: () => state.digit("7") })}
        {key("8", { onClick: () => state.digit("8") })}
        {key("9", { onClick: () => state.digit("9") })}
        {key("×", { variant: "op", onClick: () => state.setOp("*") })}

        {key("4", { onClick: () => state.digit("4") })}
        {key("5", { onClick: () => state.digit("5") })}
        {key("6", { onClick: () => state.digit("6") })}
        {key("−", { variant: "op", onClick: () => state.setOp("-") })}

        {key("1", { onClick: () => state.digit("1") })}
        {key("2", { onClick: () => state.digit("2") })}
        {key("3", { onClick: () => state.digit("3") })}
        {key("+", { variant: "op", onClick: () => state.setOp("+") })}

        {key("0", { onClick: () => state.digit("0") })}
        {key(".", { onClick: state.dot })}
        {key("=", { variant: "op", onClick: state.equals, span: 2 })}
      </div>
    </div>
  );
}

import { useCallback, useRef, useState } from "react";

function useCalculator() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOpState] = useState<Op>(null);
  const awaiting = useRef(false);

  const digit = useCallback((d: string) => {
    setDisplay((cur) => {
      if (awaiting.current) {
        awaiting.current = false;
        return d === "0" ? "0" : d;
      }
      if (cur === "0") return d;
      if (cur.length > 12) return cur;
      return cur + d;
    });
  }, []);

  const dot = useCallback(() => {
    setDisplay((cur) => (cur.includes(".") ? cur : `${cur}.`));
  }, []);

  const clear = useCallback(() => {
    setDisplay("0");
    setPrev(null);
    setOpState(null);
    awaiting.current = false;
  }, []);

  const backspace = useCallback(() => {
    setDisplay((cur) => (cur.length <= 1 ? "0" : cur.slice(0, -1)));
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay((cur) =>
      cur.startsWith("-") ? cur.slice(1) : cur === "0" ? cur : `-${cur}`,
    );
  }, []);

  const compute = useCallback((a: number, b: number, o: Op) => {
    switch (o) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  }, []);

  const setOp = useCallback(
    (next: Exclude<Op, null>) => {
      const curVal = parseFloat(display);
      if (prev === null) {
        setPrev(curVal);
      } else if (!awaiting.current && op) {
        const res = compute(prev, curVal, op);
        setPrev(res);
        setDisplay(format(res));
      }
      setOpState(next);
      awaiting.current = true;
    },
    [compute, display, op, prev],
  );

  const equals = useCallback(() => {
    if (op === null || prev === null) return;
    const curVal = parseFloat(display);
    const res = compute(prev, curVal, op);
    setDisplay(format(res));
    setPrev(null);
    setOpState(null);
    awaiting.current = true;
  }, [compute, display, op, prev]);

  return {
    display,
    prev,
    op,
    digit,
    dot,
    clear,
    backspace,
    toggleSign,
    setOp,
    equals,
  } as const;
}

function format(n: number) {
  if (!Number.isFinite(n)) return "Error";
  const str = Math.round(n * 1e10) / 1e10; // avoid fp noise
  const s = String(str);
  return s.length > 14 ? Number(str).toExponential(6) : s;
}

export default CalculatorApp;
