import {
	ApproveAllTransactions,
	ApproveSignin,
	ApproveTransaction,
	Input,
	OtaPopup,
	closeModal,
} from "./components"

export function getPassword(): Promise<string> {
	return new Promise((resolve, reject) => {
		try {
			const input = Input({ placeholder: "Enter Password" })
			const verify = Input({ placeholder: "Verify Password" })

			const approve = () => {
				const name = input.value.trim()
				if (name !== "") {
					resolve(name)
					closeModal()
				}
			}

			const cancel = () => {
				reject(new Error("Ota Approval Request Was Rejected"))
				closeModal()
			}

			ApproveSignin({ approve, cancel, input })
		} catch (err) {
			reject(new Error("Something went wrong during approval request"))
			closeModal()
		}
	})
}

export function approveTransaction(
	username?: string,
	image?: string
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		try {
			const approve = () => {
				resolve(true)
				closeModal()
			}

			const cancel = () => {
				reject(new Error("User rejected the transaction"))
				closeModal()
			}

			ApproveTransaction({ approve, cancel, username, image })
		} catch (err) {
			reject(new Error("Error occured during approval"))
			closeModal()
		}
	})
}

export function approveAllTransactions(
	username?: string,
	image?: string
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		try {
			const approve = () => {
				resolve(true)
				closeModal()
			}

			const cancel = () => {
				reject(new Error("User rejected the transactions"))
				closeModal()
			}

			ApproveAllTransactions({ approve, cancel, username, image })
		} catch (err) {
			reject(new Error("Error occured during approval"))
			closeModal()
		}
	})
}

export function renderError(message: string) {
	return new Promise((resolve, reject) => {
		try {
			const cancel = () => {
				reject(new Error(message))
				closeModal()
			}

			OtaPopup({
				cancel,
				rejectButtonText: "Close",
				message,
			})
		} catch (err) {
			reject(new Error(message))
			closeModal()
		}
	})
}
