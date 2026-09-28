import { Checkbox, Popover } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Flag } from "@/components/brand/Flag";
import { useMarkets } from "@/context/market-context";
import { MARKET_CODES, MARKET_LABELS } from "@/lib/markets";

export function CustomerMarkets() {
  const { customerMarkets, setCustomerMarkets } = useMarkets();
  const single = customerMarkets.length === 1;

  const panel = (
    <div className="w-[260px] py-1">
      <p className="text-sm font-medium text-ink">Customer markets</p>
      <p className="mt-1 text-xs leading-relaxed text-ink-500">
        Stand-in for the markets More reads from the customer's company or customer group at login.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {MARKET_CODES.map((code) => {
          const checked = customerMarkets.includes(code);
          return (
            <Checkbox
              key={code}
              checked={checked}
              disabled={checked && single}
              onChange={(event) =>
                setCustomerMarkets(
                  event.target.checked ? [...customerMarkets, code] : customerMarkets.filter((c) => c !== code),
                )
              }
            >
              <span className="inline-flex items-center gap-2">
                <Flag code={code} />
                {MARKET_LABELS[code]}
              </span>
            </Checkbox>
          );
        })}
      </div>
      <p className="mt-3 border-t border-border pt-3 text-xs text-ink-500">
        {single ? "One market, so the tabs are hidden." : `${customerMarkets.length} markets, so one tab each.`}
      </p>
    </div>
  );

  return (
    <Popover trigger="click" placement="bottomRight" arrow={false} content={panel}>
      <button
        type="button"
        aria-label="Customer markets"
        className="flex items-center gap-2 rounded-full border border-border bg-white py-1.5 pl-2.5 pr-3 text-[13px] transition hover:border-ink-300"
      >
        <span className="flex items-center -space-x-1">
          {customerMarkets.map((code) => (
            <Flag key={code} code={code} className="ring-2 ring-white" />
          ))}
        </span>
        <span className="hidden font-medium text-ink sm:inline">Customer markets</span>
        <DownOutlined className="text-[10px] text-ink-400" />
      </button>
    </Popover>
  );
}
