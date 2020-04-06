import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { isArray } from 'util';

@Injectable()
    export class ErrorInterceptor implements HttpInterceptor{
        intercept(
            req: import('@angular/common/http').HttpRequest<any>, 
            next: import('@angular/common/http').HttpHandler): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {
           return next.handle(req).pipe(
               catchError(error=>{
                   if(error.status === 401){
                       return throwError('(error type 1) '+error.statusText);
                   }
                   if(error instanceof HttpErrorResponse)//500 type errors
                   {
                       const applicationError = error.headers.get('Application-Error');
                       if(applicationError)
                       {
                           return throwError('(error type 2)' +applicationError);
                       }
                       //now for validation errors (could be more than one):
                       const serverError = error.error;//the first error is what we named the object, the second .error is what we receive in the object.
                       let modalStateErrors = '';
                       if(serverError.errors && typeof serverError.errors === 'object'){
                           for(const key in serverError.errors)//that is why we needed to check it is an object
                           {
                               if(serverError.errors[key]){
                                   modalStateErrors += serverError.errors[key] + '\n';
                               }
                           }
                       }
                       console.log(modalStateErrors || serverError || 'Server Error');
                        return throwError(modalStateErrors || serverError || 'Server Error')//if modalStateErrors has something, throw it, else throw server error (e.g. user already exists).
                        //if no error message exists, by default we throw server error, and it means we didn't catch it here and we need further investigation
                   }
               })
           )
        };

    }


    export const ErrorInterceptorProvider = {   //it adds it to a list of providers that already exists
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorInterceptor,
        multi : true //it means we want HTTP_INTERCEPTORS to user multiple interceptors
    };