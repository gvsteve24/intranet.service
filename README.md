# Intranet Service
### Intranet service is built to provide basic groupware feature for small business.

For test use, please use this in non-commercial purpose.

ID: admin@admin.com

Password: admin

* Try sending message to other available user, test!
* Try adding favorite user or message! It is on star icon.
* Try set up your on profile picture!



## Current Features
1. Membership features
    - Administration, Register, Profile update, etc.
2. Message features
    - Message sending, replying, favorite listing, etc.

## Upcoming Features
1. Continue logged-in status
2. Managing forget message

<br />

# Rest API 


## User
Users are the members of one group. This case is for team which has business department, and research department.

* ### URL
    
    `/users/register`
* ### Method
    
    `POST`
* ### Data Params
    
    ```javascript
    {
        email: 이메일 주소,
        password: 비밀번호,
        passwordConfirm: 비밀번호 확인,
        kr_name: 한글 이름,
        en_name: 영문 이름,
        department: 부서,
        address: 주소,
        phone0: 전화번호 첫번째 위치,
        phone1: 전화번호 두번째 위치,
        phone2: 전화번호 세번째 위치,
    }
    ```
* ### Success Response

    **Code:** 200<br/>
    **Content:** `{user: User document, token: Authorized token}}`

* ### Error Response

    **Code:** 401 UNAUTHORIZED<br/>
    **Content:** `{error: 'please authenticate'}`



<br/>    

---

* ### URL
    
    `/users/login`
* ### Method
    
    `POST`
* ### Data Params
    
    ```javascript
    {
        email: 이메일 주소,
        password: 비밀번호,
    }
    ```
* ### Success Response

    **Code:** 200<br/>
    **Content:** `{user: User document, token: Authorized token}}`

* ### Error Response

    **Code:** 400 Bad Request<br/>
    **Code:** 401 UNAUTHORIZED<br/>
    **Content:** `{error: 'please authenticate'}`


<br/>    

---

* ### URL
    
    `/users/me`
* ### Method
    
    `GET`
* ### Authorization Header Token Required
* ### Success Response

    **Code:** 200<br/>
    **Content:** `{user: User document, token: Authorized token}}`

* ### Error Response

    **Code:** 401 UNAUTHORIZED<br/>
    **Content:** `{error: 'please authenticate'}`


<br/>    

---

* ### URL
    
    `/users`
* ### Method
    
    `GET`
* ### Authorization Header Token Required
* ### URL Params
    
    **Optional**
    
    * `/users/kr_name={}` : response contains users with matching Korean name in User document.
    * `/users/phone={}` : response contains users with matching phone number in User document.
    * `/users/department={}` : response contains users with matching department in User document.
    * `/users/favorites={}` : response contains users with matching favortite user in User document.
* ### Success Response

    **Code:** 200<br/>
    **Content:** `{user: User document, token: Authorized token}}`

* ### Error Response
    **Code:** 400 Bad Request<br/>
    **Code:** 401 UNAUTHORIZED<br/>
    **Content:** `{error: 'please authenticate'}`


<br/>    

---

* ### URL
    
    `/users/logout`
* ### Method
    
    `POST`
* ### Authorization Header Token Required
* ### Success Response

    **Code:** 200<br/>
    **Content:** `{user: requested User document}`

* ### Error Response

    **Code:** 500 Internal Server Error<br/>
    **Code:** 401 UNAUTHORIZED<br/>
    **Content:** `{error: 'please authenticate'}`


<br/>    

---

* ### URL
    
    `/users/logoutAll`
* ### Method
    
    `POST`
* ### Authorization Header Token Required
* ### Success Response

    **Code:** 200<br/>
    **Content:** `{user: requested User document}`

* ### Error Response

    **Code:** 500 Internal Server Error<br/>
    **Code:** 401 UNAUTHORIZED<br/>
    **Content:** `{error: 'please authenticate'}`


<br/>    

---

* ### URL
    
    `/users/password`
* ### Method
    
    `PATCH`
    
* ### Data Params
    
    ```javascript
    {
        passwordCurrent: 현재 비밀번호,
        password: 새 비밀번호,
        passwordConfirm: 비밀번호 확인
    }
    ```
* ### Success Response

    **Code:** 200<br/>
    **Content:** `{user: User document}`

* ### Error Response

    **Code:** 400 Bad Request<br/>
    **Code:** 401 UNAUTHORIZED<br/>
    **Content:** `{error: 'please authenticate'}`


<br/>    

---

* ### URL
    
    `/users/info`
* ### Method
    
    `PATCH`
* ### Authorization Header Token Required
* ### Data Params
    
    ```javascript
    {
        avatar: 프로필 사진,
        email: 이메일 주소,
        kr_name: 한글 이름,
        en_name: 영문 이름,
        department: 부서,
        address: 주소, 
        phone0: 전화번호 첫번째 위치,
        phone1: 전화번호 두번째 위치,
        phone2: 전화번호 세번째 위치,
    }
    ```
* ### Middleware 
    
    **UploadUserPhoto**

    * To deliever file format in multipart/form-data, library multer is used as node.js middleware.
* ### Success Response

    **Code:** 200<br/>
    **Content:** `{user: User document}`

* ### Error Response

    **Code:** 400 Bad Request<br/>
    **Code:** 401 UNAUTHORIZED<br/>
    **Content:** `{error: 'please authenticate'}`

<br/>    

---

* ### URL
    Toggle id-queried user as favorite/non-favorite user.
    
    `/users/:id`
* ### Method
    
    `PATCH`
* ### Authorization Header Token Required
* ### Url params

    **Required**

    `/users/:id`: Required parameter, param is used as id value to retrieve User document.
* ### Success Response

    **Code:** 200<br/>
    **Content:** `{user: User document}`

* ### Error Response

    **Code:** 500 Internal Server Error<br/>

<br/>    

---

* ### URL
    Add favorite messages to User document. If favorite message is registered, toggles its boolean value to un-favorite.

    `/users`
* ### Method
    
    `PATCH`
* ### Authorization Header Token Required
* ### Url params

    **Required**

    `/users?message=_id`: Required parameter, param is used as id value to retrieve Message document.
* ### Success Response

    **Code:** 200<br/>
    **Content:** `{user: User document}`

* ### Error Response

    **Code:** 500 Internal Server Error<br/>


<br/>    

---

* ### URL
    Remove User document permanently.

    `/users/me`
* ### Method
    
    `DELETE`
* ### Authorization Header Token Required
* ### Success Response

    **Code:** 200<br/>
    **Content:** `{user: User document}`

* ### Error Response

    **Code:** 400 Bad Request<br/>
## Further rest api call updates

* `/users`: delete

