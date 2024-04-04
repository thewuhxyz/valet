import nacl from "tweetnacl"
import util from "tweetnacl-util"

export const generateSecret = () =>
	util.encodeBase64(nacl.randomBytes(nacl.secretbox.keyLength))
