import { readFileSync, writeFileSync } from "fs"
import { sendNotif } from './sendnotif'
import { createHash } from "crypto"
import { JSDOM } from "jsdom"
import get from "axios"

const args = require('yargs').argv

const compareArr = (arr1: Array<string>, arr2: Array<string>) => arr1.length === arr2.length && arr1.every((v: string, i: number) => v === arr2[i])
const checkObject = (obj: object) => Object.keys(obj).length === 0 && obj.constructor === Object
const generateHash = (content: string) => createHash("md5").update(content).digest("hex")

const cash = "cash.json"
const lngf = Object.keys(args).length
const title = args.title
const address = args.address || args.a
const htmlTag = args.tag || args.t
const image = args.img || args.i

if (compareArr(args._, ["add"]) && address && htmlTag && title) {
	const hash = await getElementHash(address, htmlTag)
	const temp = {
		[address]: {
			title: title,
			url: address,
			tag: htmlTag,
			hash: hash,
			img: image
		}
	}

	try {
		const jsonData = JSON.parse(readFileSync(cash))
		const data = { ...jsonData, ...temp }
		writeFileSync(cash, JSON.stringify(data));

	} catch (error) {
		console.error("\n");
		throw error;
	}
}

else if (compareArr(args._, ["remove"]) && lngf == 2) {
	try {
		const jsonData = JSON.parse(readFileSync(cash))
		const novelLs = Object.keys(jsonData)
		novelLs.map((e, i) => { console.log(`${i + 1}: ${jsonData[e].title}`) })

		const temp = Number(prompt("\n select a novel to delete: "))
		if (!(0 < temp && temp <= novelLs.length)) {
			throw "number is invalid";
		}
		delete jsonData[novelLs[temp - 1]]
		writeFileSync(cash, JSON.stringify(jsonData));

	} catch (error) {
		console.error("\n");
		throw error;
	}
}

else if (compareArr(args._, []) && lngf == 2) {
	const handler = async () => {

		try {
			const jsonData = JSON.parse(readFileSync(cash))

			if (checkObject(jsonData)) {
				throw "no novel to monitor";
			}

			for (const key in jsonData) {
				const currentHash = jsonData[key].hash
				const newHash = await getElementHash(key, jsonData[key].tag)
				if (currentHash !== newHash) {
					jsonData[key].hash = newHash
					sendNotif(jsonData[key])
				}
			}
			writeFileSync(cash, JSON.stringify(jsonData));

		} catch (error) {
			console.error("\n");
			throw error;
		}
	}
	handler()
	setInterval(handler, 3600000)
}

else {
	console.error("Invalid argument list")
}

async function getElementHash(url: string, htmlTag: string) {
	try {
		const response = await get(url)
		const dom = new JSDOM(response.data)
		const htmlElement = dom.window.document.querySelector(htmlTag).innerHTML
		console.log(htmlElement);
		return generateHash(htmlElement)

	} catch (e) {
		console.error("\ncant fetch site")
		throw e;
	}
}

export { }
