export type id = number;

export type MetaElementId = id;

export type MetaElement = {
	__class: "MetaPackage" | "MetaClass" | "MetaInterface" | "MetaMethod" | "MetaConstructorCall" | "MetaField" | "MethodCall"
	name: string,
	refactorings: string[],
	id: MetaElementId,
}

export type MetaRelation = {
	creator: MetaElement,
	accepter: MetaElement,
}

export type MetaRelationGroup = {
	relations: MetaRelation[],
	creators: Map<MetaElement, MetaRelation>
	receivers: Map<MetaElement, MetaRelation[]>
}

export type MetaModel = {
	metaElements: MetaElement[],
	rootMetaElements: MetaElement[],
	parentChildRelations: MetaRelationGroup,
}