import {
    accountForgotPassword, accountLogin, accountLoginOTP, accountLogout, accountPaymentInfoPOST, accountPaymentInfoPUT, accountRegister,
    accountResetPassword, accountUpdate, accountUpdatePassword, accountValidateCode, accountVerifyOTP
} from "./Collections/accountAPIs";
import { commentAll, commentId, commentIdDislike, commentIdLike, commentNew } from "./Collections/commentAPIs";
import { organisationAll, organisationAllName, organisationApply, organisationCategories, organisationId } from "./Collections/organisationAPIs";
import { postAll, postIdDEL, postIdDislike, postIdImageDEL, postIdLike, postIdPATCH, postIdPOST, postNew, postIdPin, postIdUnpin } from "./Collections/postAPIs";
import { replyId, replyIdDislike, replyIdLike, replyNew } from "./Collections/replyAPIs";
import { transactionNew } from "./Collections/transactionAPIs";

export {
    accountForgotPassword, accountLogin, accountLoginOTP, accountLogout, accountPaymentInfoPOST, accountPaymentInfoPUT, accountRegister,
    accountResetPassword, accountUpdate, accountUpdatePassword, accountValidateCode, accountVerifyOTP
};
export { commentAll, commentId, commentIdDislike, commentIdLike, commentNew };
export { organisationAll, organisationAllName, organisationApply, organisationCategories, organisationId };
export { postAll, postIdDEL, postIdDislike, postIdImageDEL, postIdLike, postIdPATCH, postIdPOST, postNew, postIdPin, postIdUnpin };
export { replyId, replyIdDislike, replyIdLike, replyNew };
export { transactionNew };
