type TreeItemData = {
	name: string,
	type: "PtPackage" | "PtClass" | "PtMethod",
	open: boolean,
	children: TreeItemData[]
};