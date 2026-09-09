import { Fields } from "@/types/parsed/field";

export const filterFields = (obj: Fields, format: string): Fields => {
    const filteredEntries = Object.entries(obj).filter(([, field]) =>
        (field?.codings?.[format as keyof typeof field.codings]?.length ?? 0) > 0
    );

    return Object.fromEntries(filteredEntries) as Fields;
};