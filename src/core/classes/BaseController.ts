import { ApiRequest, ApiResponse, ProblemDetail } from '../../data/models/generic/ApiModel';
import { CreateResponse, HandleError } from '@/src/core/helpers/RestHelpers';
import IAuthenticationService from '@/src/core/services/authentication/IAuthenticationService';

abstract class BaseController {
    protected authService: IAuthenticationService;

    constructor(authService: IAuthenticationService) {
        this.authService = authService;
    }

    protected async validateAccessToken(req: ApiRequest<any, any, any>): Promise<ApiResponse<null> | null> {
        const accessToken = req.headers.accesstoken;
        if (!accessToken) {
            return CreateResponse<null>(
                'error', 
                'Access token is required', 
                undefined
            );
        }

        const isTokenValid = await this.authService.ValidateTokenAsync(accessToken.toString());
        if (!isTokenValid.isValid) {
            return CreateResponse<null>(
                'error', 
                isTokenValid?.message ?? "", 
                undefined
            );
        }

        return null;
    }

    protected handleError(error: any): ProblemDetail {
        return HandleError(error) as ProblemDetail;
    }
}

export default BaseController;