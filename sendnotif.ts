import { execSync } from "child_process"
type novelT = {
	title: string,
	url: string,
	tag: string,
	hash: string,
	img: string,
}
type sendNotifT = (webNovel: novelT) => void

export const sendNotif: sendNotifT = (webNovel) => {
	console.log(`dunstify -A "${webNovel.url}","open chapter" "${webNovel.title}" "\nNew Chapter of ${webNovel.title}" -i ${webNovel.img} | xargs firefox&`)
	execSync(`dunstify -A "${webNovel.url}","open chapter" "${webNovel.title}" "\nNew Chapter of ${webNovel.title}" -i ${webNovel.img} | xargs firefox&`)
}
