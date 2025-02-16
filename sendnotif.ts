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
	execSync(`dunstify -A "${webNovel.url}","open chapter" "${webNovel.title}" "\nNew Chapter of ${webNovel.title}" | xargs firefox&`)
}
