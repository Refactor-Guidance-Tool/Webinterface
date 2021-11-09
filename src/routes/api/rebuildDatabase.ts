import type { RequestHandler } from '@sveltejs/kit';
import fs from "fs";
import { execSync } from "child_process";

const get: RequestHandler = async (req) => {
	fs.rmSync("./static/database", {
		recursive: true,
		force: true,
	});
	
	const res = execSync("cd C:/Users/Tjakka5/Documents/TestProj & codeql database create --language=csharp -M=8192 -j=0 C:/Users/Tjakka5/Documents/RefactorGuidanceTool/Frontend/Website/static/database");

	return {
		body: {
			
		}
	};
};

export { get };
