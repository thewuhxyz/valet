export interface ModalProps {
	cancel: () => void;
}

export interface BodyProps {
	message: string;
	username?: string;
	image?: string;
}

export interface InputProps {
	placeholder: string;
}

export interface FooterProps {
	approveButtonText?: string;
	rejectButtonText?: string;
	approve?: () => void;
	cancel?: () => void;
	input?: HTMLInputElement;
}

export type PageProps = BodyProps & FooterProps & ModalProps;

export interface ApproveSignInProps {
	approve: () => void;
	cancel: () => void;
	input: HTMLInputElement;
}

export interface ApproveTransactionProps {
	approve: () => void;
	cancel: () => void;
	username: string | undefined;
	image: string | undefined;
}
