import type { RequestHandler } from '@sveltejs/kit';
import fs from "fs";

const get: RequestHandler = async (req) => {
	const fileContents = (fs.readFileSync('./static/print-ast.dot')).toString();

	return {
		body: {
			ast: fileContents,
		}
	};
};

export { get };
