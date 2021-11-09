import type { LoadInput } from '@sveltejs/kit';

const AdvFetch = async <T>(
	url: string,
	{ fetch }: LoadInput,
	searchParams?: Record<string, string | boolean>
): Promise<{
	success: boolean;
	data?: T;
	res: Response;
}> => {
	const transformedSearchParams: Record<string, string> = {};

	if (searchParams != undefined) {
		for (const key in searchParams) {
			let value = searchParams[key];
			if (value === true) value = 'true';
			if (value === false) value = 'false';

			transformedSearchParams[key] = value;
		}
	}

	const queryString = new URLSearchParams(transformedSearchParams).toString();
	const fullUrl = `${url}?${queryString}`;

	const res = await fetch(fullUrl);

	if (res.ok) {
		const data = await res.json();
		return {
			success: true,
			data: data,
			res: res
		};
	} else {
		return {
			success: false,
			res: res
		};
	}
};

export { AdvFetch };
