export const MoneyUsageMap: Record<string, number> = ({
    ["prod"]: {
        "29.90": 1,
        "79.90": 3,
    },
    ["local"]: {
        "0.01": 1,
        "0.05": 3,
    },
})[Deno.env.get("ENV") ?? "prod"] as Record<string, number>;
