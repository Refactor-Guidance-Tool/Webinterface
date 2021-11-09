import type { RequestHandler } from '@sveltejs/kit';
import { parse } from '@ts-graphviz/parser';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import csv from "csv-parser";

const get: RequestHandler = async (req) => {
	const className = req.params["name"];

	console.log("Compiling detectors...");
	copyFolderRecursiveSync(
		'C:/Users/Tjakka5/Documents/RefactorGuidanceTool/Frontend/Website/ql/csharp/RC',
		'C:/Users/Tjakka5/Documents/RefactorGuidanceTool/Frontend/Website/ql/csharp/RC-compiled',
		className
	);
	console.log("Compiled detectors!");

	console.log("Running detectors...");
	const res = execSync(
		'cd C:/Users/Tjakka5/Documents/RefactorGuidanceTool/Frontend/Website/static & codeql database analyze --rerun --format=csv --output=RC.csv --threads=0 database C:/Users/Tjakka5/Documents/RefactorGuidanceTool/Frontend/Website/ql/csharp/RC-compiled'
	);
	console.log("Ran detectors!");

	console.log("Parsing results...")

	type Result = {
		detector: string,
		message: string,
	};

	const readCsv = async () => {
		const results: Result[] = [];

		return new Promise<Result[]>((resolve, reject) => {
			try {
				fs.createReadStream("./static/RC.csv")
				.pipe(csv(["detector", "description", "kind", "message", "sourceFile", "sourceStartLine", "sourceStartChar", "sourceEndLine", "sourceEndChar"]))
					.on('data', (data) => results.push(data))
					.on('end', () => {
						resolve(results)
					})
			} catch (e) {
				reject(e)
			}
		})
	}
	const results = await readCsv();
	console.log("Parsed results!")

	return {
		body: {
			results: results
		}
	};
};

function copyFileSync(source, target, classToBeRemoved) {
	let targetFile = target;

	// If target is a directory, a new file with the same name will be created
	if (fs.existsSync(target)) {
		if (fs.lstatSync(target).isDirectory()) {
			targetFile = path.join(target, path.basename(source));
		}
	}

	const contents = fs.readFileSync(source).toString();
	const newContents = contents.replace('$CLASS_TO_BE_REMOVED', classToBeRemoved);

	fs.writeFileSync(targetFile, newContents);
}

function copyFolderRecursiveSync(source, target, classToBeRemoved) {
	let files = [];

	// Check if folder needs to be created or integrated
	const targetFolder = target;
	if (fs.existsSync(targetFolder)) {
		fs.rmSync(targetFolder, {
			recursive: true,
			force: true
		})
	}
	if (!fs.existsSync(targetFolder)) {
		fs.mkdirSync(targetFolder);
	}

	// Copy
	if (fs.lstatSync(source).isDirectory()) {
		files = fs.readdirSync(source);
		files.forEach(function (file) {
			const curSource = path.join(source, file);
			if (fs.lstatSync(curSource).isDirectory()) {
				copyFolderRecursiveSync(curSource, targetFolder, classToBeRemoved);
			} else {
				copyFileSync(curSource, targetFolder, classToBeRemoved);
			}
		});
	}
}

export { get };
