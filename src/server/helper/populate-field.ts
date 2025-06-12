import mongoose, { Model, Document } from "mongoose";

interface PopulateFieldsParams<T> {
    model: Model<T>;
    id: string | number | unknown | mongoose.Types.ObjectId;
    fields: string[];
    select?: string;
    combineUserName?: boolean;
}

function combineNames(obj: Record<string, any>) {
    if (Array.isArray(obj)) {
        obj.forEach(combineNames);
    } else if (obj && typeof obj === "object") {
        if (
            typeof obj === "object" &&
            obj !== null &&
            "f_name" in obj &&
            "l_name" in obj
        ) {
            const o = obj as { f_name?: string; l_name?: string; name?: string };
            o.name = `${o.f_name} ${o.l_name}`;
            delete o.f_name;
            delete o.l_name;
        }
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                combineNames(obj[key]);
            }
        }
    }
}


export async function populateFields<T extends Document>({
    model,
    id,
    fields,
    select = "_id f_name l_name",
    combineUserName = true
}: PopulateFieldsParams<T>) {
    let query = model.findById(id);
    for (const field of fields) {
        query = query.populate({ path: field, select });
    }
    const doc = await query.exec();
    if (!doc) {
        throw new Error("Document not found");
    }
    const result = doc.toObject() as Record<string, any>;
    if (combineUserName) {
        combineNames(result);
    }
    return result;
}