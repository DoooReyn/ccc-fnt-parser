import fs from "fs";

/**
 * 通用 fnt 解析器
 * @description 原理：
 * 1. 逐行读取文件
 * 2. 每行按空格分割，数组的第一个是主键，剩余部分则视为子串
 * 3. 将子串逐个按=分割，左边为子键，右边为子值，根据子键可以按照自己的需求解析出子值（这里是通用解析器，所以保留原始类型）
 * 4. 每次读取一行进行解析，并记录上一个主键和当前主键
 * 5. 解析步骤1：如果主键为空，则跳过（通常是空行）；如果主键不为空，则展开解析子键与子值
 * 6. 解析步骤2：如果当前主键与上一个主键相同，说明需要进行合并（将此主键内容视为数组）
 * 7. 解析完成，将结果冻结为字符串形式和JSON对象形式
 * @example
 * ```typescript
 * const parser = FntParser.parse("path/to/fnt/file");
 * // 可以将字符串内容写入文件
 * const content_string = parser.toString();
 * fs.writeFileSync("path/to/output/file", content_string, {encoding: "utf-8"});
 * // 也可以根据自己的需求定制输出内容
 * const content_json = parser.toJSON();
 * const result = {
 *   commonHeight: content_json.common.height,
 *   // ...
 * };
 * fs.writeFileSync("path/to/output/file", JSON.stringify(content_string, null, 0), {encoding: "utf-8"});
 * ```
 */
export class FntParser {
    /** 输入文件路径 */
    private _path: string;
    /** 输出数据 */
    private _table: Record<string, Record<string, any>>;
    /** 输出数据（字符串形式） */
    private _resultString: string | null;
    /** 输出数据（JSON对象形式） */
    private _resultJSON: Record<string, Record<string, any>> | null;

    /**
     * 通用 fnt 解析器
     * @param path 输入文件路径
     */
    private constructor(path: string) {
        this._path = path;
        this._table = {};
        this._resultString = null;
        this._resultJSON = null;
    }

    /** 解析 */
    private parse() {
        const fnt = fs.readFileSync(this._path, { encoding: "utf-8" });
        const lines = fnt.split("\n");
        var line: string;
        var line_pieces: string[];
        var pre_main_key: string = "";
        var main_key: string;
        var line_rest: string[];
        for (let i = 0, l = lines.length; i < l; i++) {
            line = lines[i];
            line_pieces = line.split(" ");
            [main_key, ...line_rest] = line_pieces;
            this.parseLine(pre_main_key, main_key, line_rest);
            pre_main_key = main_key;
        }
        this._resultJSON = Object.freeze(this._table);
        this._resultString = JSON.stringify(this._resultJSON, null, 2);
        return this;
    }

    /**
     * 解析当前行
     * @param pre_main_key 前一个主键
     * @param main_key 当前主键
     * @param line_rest 剩余部分
     * @returns
     */
    private parseLine(pre_main_key: string, main_key: string, line_rest: string[]) {
        if (main_key.length == 0) return;
        var sub_key: string;
        var sub_val: string;
        var table: Record<string, any> = {};
        for (let i = 0, l = line_rest.length; i < l; i++) {
            [sub_key, sub_val] = line_rest[i].split("=");
            table[sub_key] = this.parseValue(sub_key, sub_val);
        }
        if (pre_main_key == main_key) {
            if (!Array.isArray(this._table[main_key])) {
                this._table[main_key] = [this._table[main_key], table];
            } else {
                this._table[main_key].push(table);
            }
        } else {
            this._table[main_key] = table;
        }
    }

    /**
     * 解析子键与子值
     * @param key 子键
     * @param value 子值
     * @returns
     */
    private parseValue(key: string, value: string) {
        var ret: any = value;
        switch (key) {
            case "face":
            case "charset":
            case "file":
                ret = value.replace(/"/g, "");
                break;
            case "size":
            case "bold":
            case "italic":
            case "unicode":
            case "stretchH":
            case "smooth":
            case "aa":
            case "lineHeight":
            case "base":
            case "scaleW":
            case "scaleH":
            case "pages":
            case "packed":
            case "id":
            case "count":
            case "x":
            case "y":
            case "width":
            case "height":
            case "xoffset":
            case "yoffset":
            case "xadvance":
            case "page":
            case "chnl":
                ret = +value;
                break;
            case "padding":
            case "spacing":
                ret = value.split(",").map((x) => +x);
                break;
        }
        return ret;
    }

    /** 获取字符串形式的结果 */
    public toString() {
        return this._resultString!;
    }

    /** 获取JSON对象形式的结果 */
    public toJSON() {
        return this._resultJSON!;
    }

    /**
     * 解析Fnt文件
     * @param path 输入文件路径
     * @returns 
     */
    public static parse(path: string) {
        return new FntParser(path).parse();
    }
}
