
//分页查询
export interface QueryList {
    currentPage: number;
    pageSize: number;
}

//字典
export interface Dict {
    label: string;
    value: string | number;
}

//人影单位分页查询
export interface RyUnitQuery extends QueryList {
    strID?: string;
    strName?: string;
}

//人影作业点分页查询
export interface RyOperationOpintQuery extends QueryList {
    strCode?: string;
    strName?: string;
}