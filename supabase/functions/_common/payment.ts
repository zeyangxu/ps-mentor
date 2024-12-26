export const MoneyUsageMap: Record<string, number> = ({
    ["prod"]: {
        "19.90": 1,
        "79.90": 5,
    },
    ["local"]: {
        "0.01": 1,
        "0.05": 5,
    },
})[Deno.env.get("ENV") ?? "prod"] as Record<string, number>;
