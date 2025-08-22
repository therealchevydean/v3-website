"use client";

import { useEffect, useState, useCallback } from "react";

type Status = "idle" | "not_installed" | "installed" | "connecting" | "connected" | "error";

function shorten(addr: string) {
  return addr ? addr.slice(0, 6) + "" + addr.slice(-4) : "";
}

export default function WalletButton() {
  const [status, setStatus] = useState<Status>("idle");
  const [account, setAccount] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const hasEthereum = typeof window !== "undefined" && (window as any).ethereum;

  const checkAccounts = useCallback(async () => {
    if (!hasEthereum) {
      setStatus("not_installed");
      return;
    }
    try {
      const accs = await (window as any).ethereum.request({ method: "eth_accounts" });
      if (Array.isArray(accs) && accs.length > 0) {
        setAccount(accs[0]);
        setStatus("connected");
      } else {
        setAccount(null);
        setStatus("installed");
      }
    } catch (e: any) {
      setErr(e?.message ?? String(e));
      setStatus("error");
    }
  }, [hasEthereum]);

  useEffect(() => {
    checkAccounts();

    // Auto-connect only if user opted in previously
    if (typeof window !== "undefined" && localStorage.getItem("v3:autoConnect") === "1") {
      (async () => {
        try {
          await (window as any).ethereum?.request?.({ method: "eth_requestAccounts" });
          checkAccounts();
        } catch {
          localStorage.removeItem("v3:autoConnect");
        }
      })();
    }

    if (!hasEthereum) return;
    const eth = (window as any).ethereum;

    const handleAccounts = (accs: string[]) => {
      if (accs?.length) {
        setAccount(accs[0]);
        setStatus("connected");
      } else {
        setAccount(null);
        setStatus("installed");
      }
    };
    const handleChain = () => checkAccounts();

    eth.on?.("accountsChanged", handleAccounts);
    eth.on?.("chainChanged", handleChain);
    return () => {
      eth.removeListener?.("accountsChanged", handleAccounts);
      eth.removeListener?.("chainChanged", handleChain);
    };
  }, [checkAccounts, hasEthereum]);

  const connect = async () => {
    if (!hasEthereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    setStatus("connecting");
    setErr(null);
    try {
      const accs = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      if (Array.isArray(accs) && accs.length > 0) {
        setAccount(accs[0]);
        setStatus("connected");
        localStorage.setItem("v3:autoConnect", "1");
      } else {
        setStatus("installed");
      }
    } catch (e: any) {
      setErr(e?.message ?? String(e));
      setStatus("installed");
    }
  };

  const disconnect = () => {
    localStorage.removeItem("v3:autoConnect");
    setAccount(null);
    setStatus("installed");
  };

  const label =
    status === "connected" && account
      ? `Connected: ${shorten(account)}`
      : status === "connecting"
      ? "Connecting"
      : status === "not_installed"
      ? "Install MetaMask"
      : "Connect Wallet";

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={status === "connected" ? disconnect : connect}
        className={`rounded px-3 py-1.5 text-sm border border-white/20 ${
          status === "connected" ? "bg-white/10" : "hover:bg-white/10"
        }`}
      >
        {label}
      </button>
      {err && status !== "connecting" && (
        <span className="text-xs text-red-400 max-w-[260px] truncate" title={err}>
          {err}
        </span>
      )}
    </div>
  );
}
