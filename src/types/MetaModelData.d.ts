import type { MetaElementId as MetaElementID } from "./MetaModel";

export type MetaRelationID = number;

export type MetaElementData = {
	id: MetaElementID,
	name: string,
	refactorings: string[],

} & ({
	__class: "MetaPackage",
} | {
	__class: "MetaClass",
} | {
	__class: "MetaInterface"
} | {
	__class: "MetaMethod",
} | {
	__class: "MetaConstructorCall",
})

export type MetaRelationData = {
	id: MetaRelationID;
	creator: MetaElementID,
	accepter: MetaElementID,
}

export type MetaRelationGroupData = {
	relations: MetaRelationData[],
	creators: {[key: MetaElementID]: MetaElementID}
	receivers: {[key: MetaElementID]: MetaElementID[]}
}

export type MetaModelData = {
	metaElements: MetaElementData[],
	rootMetaElements: MetaElementID[],
	parentChildRelations: MetaRelationGroupData,
}