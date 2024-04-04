import { styleSheet } from "./stylesheet"
import {
	ApproveSignInProps,
	ApproveTransactionProps,
	BodyProps,
	FooterProps,
	InputProps,
	ModalProps,
	PageProps,
} from "./types"
import {
	OTA_MODAL_ID,
	LOGO_SVG_STRING,
	createUsernameMessage,
	approveTransactionMessage,
	approveTransactionsMessage,
} from "./constants"

function Modal({ cancel }: ModalProps) {
	const modalContainer = document.createElement("div")
	modalContainer.setAttribute("id", OTA_MODAL_ID)
	modalContainer.classList.add("modal-container")
	document.body.appendChild(modalContainer)

	modalContainer.onclick = (event) => {
		if (event.target === modalContainer) cancel()
	}

	const styleElement = document.createElement("style")
	styleElement.appendChild(document.createTextNode(styleSheet))
	modalContainer.appendChild(styleElement)

	return modalContainer
}

export function closeModal() {
	const modal = document.getElementById(OTA_MODAL_ID)
	if (modal) {
		modal.remove()
	}
}

function Popup() {
	const popup = document.createElement("div")
	popup.classList.add("valet-ota-popup")

	return popup
}

function Header() {
	const headerContainer = document.createElement("div")
	headerContainer.classList.add("valet-ota-popup-header")

	const tempContainer = document.createElement("div")
	tempContainer.innerHTML = LOGO_SVG_STRING

	const logoSvg = tempContainer.firstChild!
	headerContainer.appendChild(logoSvg)

	tempContainer.remove()

	const headerSubtitle = document.createElement("p")
	headerSubtitle.classList.add("italic")
	headerSubtitle.textContent = `
    The First Social Login Wallet on Solana
  `

	headerContainer.appendChild(headerSubtitle)

	return headerContainer
}

function Body({ message, image, username }: BodyProps) {
	const bodyContainer = document.createElement("div")
	bodyContainer.classList.add("valet-ota-popup-body", "flex-1")

	const profileBar = document.createElement("div")
	profileBar.classList.add("valet-ota-popup-body-profile-bar", "italic")

	if (image) {
		const userImage = document.createElement("img")
		userImage.classList.add("valet-ota-popup-profile-image")
		userImage.src = image
		userImage.alt = "user-image"
		userImage.width = 6
		userImage.height = 6
		profileBar.appendChild(userImage)
	}

	profileBar.textContent = `At your service${username ? `, ${username}` : ""}!`

	const messageArea = document.createElement("div")
	messageArea.classList.add("valet-ota-popup-body-message-area", "flex-1")

	const messageText = document.createElement("p")
	messageText.textContent = message

	messageArea.appendChild(messageText)

	bodyContainer.appendChild(profileBar)
	bodyContainer.appendChild(messageArea)
	return bodyContainer
}

export function Input({ placeholder }: InputProps) {
	const input = document.createElement("input")
	input.type = "password"
	input.placeholder = placeholder

	return input
}

function Footer({
	approveButtonText,
	rejectButtonText,
	input,
	approve,
	cancel,
}: FooterProps) {
	const footerContainer = document.createElement("div")
	footerContainer.classList.add("valet-ota-popup-footer")

	if (input && approve) {
		const visibilityButton = document.createElement("button")

		let visibility: boolean = false
		visibilityButton.classList.add(visibility ? "invisible" : "invisible")
		visibilityButton.textContent = visibility ? "visible" : "invisible"
		visibilityButton.onclick = () => {
			visibility = !visibility

			if (visibility) {
				visibilityButton.classList.add("visible")
				visibilityButton.classList.remove("invisible")
				visibilityButton.textContent = "visible"
				input.type = "text"
			} else {
				visibilityButton.classList.add("invisible")
				visibilityButton.classList.remove("visible")
				visibilityButton.textContent = "invisible"
				input.type = "password"
			}
		}

		input.classList.add("full-width")

		input.addEventListener("keypress", (event) => {
			if (event.key === "Enter") approve()
		})

		const checkboxContainer = document.createElement("div")
		checkboxContainer.classList.add("checkbox-container", "full-with")

		checkboxContainer.appendChild(input)
		checkboxContainer.appendChild(visibilityButton)

		footerContainer.appendChild(checkboxContainer)
	}

	if (approve && approveButtonText) {
		const approveButton = document.createElement("button")
		approveButton.classList.add("approve", "full-width")
		approveButton.textContent = approveButtonText
		approveButton.onclick = approve
		footerContainer.appendChild(approveButton)
	}

	if (cancel && rejectButtonText) {
		const rejectButton = document.createElement("button")
		rejectButton.classList.add("cancel", "full-width")
		rejectButton.textContent = rejectButtonText
		rejectButton.onclick = cancel
		footerContainer.appendChild(rejectButton)
	}

	return footerContainer
}

export function OtaPopup({
	approve,
	cancel,
	input,
	message,
	image,
	username,
	approveButtonText,
	rejectButtonText,
}: PageProps) {
	const header = Header()

	const body = Body({
		message,
		image,
		username,
	})

	const footer = Footer({
		approveButtonText,
		rejectButtonText,
		input,
		approve,
		cancel,
	})

	const popup = Popup()
	popup.appendChild(header)
	popup.appendChild(body)
	popup.appendChild(footer)

	const modal = Modal({ cancel })
	modal.appendChild(popup)
}

export function ApproveSignin({ approve, cancel, input }: ApproveSignInProps) {
	OtaPopup({
		approve,
		cancel,
		approveButtonText: "Submit",
		rejectButtonText: "Cancel",
		message: createUsernameMessage,
		input,
	})
}

export function ApproveTransaction({
	approve,
	cancel,
	username,
	image,
}: ApproveTransactionProps) {
	OtaPopup({
		approve,
		cancel,
		approveButtonText: "Approve Transaction",
		rejectButtonText: "Cancel",
		message: approveTransactionMessage,
		username,
		image,
	})
}

export function ApproveAllTransactions({
	approve,
	cancel,
	username,
	image,
}: ApproveTransactionProps) {
	OtaPopup({
		approve,
		cancel,
		approveButtonText: "Approve All Transactions",
		rejectButtonText: "Cancel",
		message: approveTransactionsMessage,
		username,
		image,
	})
}
