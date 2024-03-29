# NestJs Boilerplate  🔥 🚀

> This repo will representative of authentication service and authorization service

[Http NestJs v10.x][ref-nestjs] boilerplate. Best uses for backend service.

## Important

> Very limited documentation!

* The features will be relate with AWS
* Stateless Authorization
* If you want to implement `database transactions`. You must run MongoDB as a `replication set`.
* If you want to implement `Google SSO`. 
    1. You must have google account, then set your app on `google console` to get the  `clientId` and `clientSecret`.
* If you change the environment value of `APP_ENV` to `production`, that will trigger.
    1. CorsMiddleware will implement `src/configs/middleware.config.ts`.
    2. Documentation will `disable`.

## Next Todo

Next development

* [ ] Update Documentation, add behaviors
* [ ] Update Documentation, include an diagram for easier comprehension

## Build with

Describes which version.

| Name       | Version  |
| ---------- | -------- |
| NestJs     | v10.x     |
| Nestjs Swagger | v7.x |
| NodeJs     | v18.x    |
| Typescript | v5.x     |
| Mongoose   | v7.x     |
| MongoDB    | v6.x     |
| Yarn       | v1.x     |
| NPM        | v8.x     |
| Docker     | v20.x    |
| Docker Compose | v2.x |

## Objective

* Easy to maintenance
* NestJs Habit
* Component based / modular folder structure
* Stateless authentication and authorization
* Repository Design Pattern or Data Access Layer Design Pattern
* Follow Community Guide Line
* Follow The Twelve-Factor App
* Adopt SOLID and KISS principle
* Support for Microservice Architecture, Serverless Architecture, Clean Architecture, and/or Hexagonal Architecture

## Features

### Main Features

* NestJs 10.x 🥳
* Typescript 🚀
* Production ready 🔥
* Repository Design Pattern (Multi Repository, can mix with other orm)
* Swagger / OpenAPI 3 included
* Authentication (`Access Token`, `Refresh Token`, `API Key`)
* Authorization, Role and Permission Management
* Google SSO for Login and Sign Up
* Support multi-language `i18n` 🗣, can controllable with request header `x-custom-lang`
* Request validation for all request params, query, dan body with `class-validation`
* Serialization with `class-transformer`
* Url Versioning, default version is `1`
* Server Side Pagination
* Import and export data with CSV or Excel by using `decorator`

### Database

* MongoDB integrate by using [mongoose][ref-mongoose] 🎉
* Multi Database
* Database Transaction
* Database Soft Delete
* Database Migration

### Logger and Debugger

* Logger with `Morgan`
* Debugger with `Winston` 📝

### Security

* Apply `helmet`, `cors`, and `throttler`
* Timeout awareness and can override ⌛️
* User agent awareness, and can whitelist user agent

### Setting

* Support environment file
* Centralize configuration 🤖
* Centralize response
* Centralize exception filter
* Setting from database 🗿

### Third Party Integration

* SSO `Google`
* Storage integration with `AwsS3`
* Upload file `single` and `multipart` to AwsS3

### Others

* Support Docker installation
* Support CI/CD with Github Action or Jenkins
* Husky GitHook for run linter before commit 🐶
* Linter with EsLint for Typescript

## Structure

### Folder Structure

1. `/app` The final wrapper module
2. `/common` The common module
3. `/configs` The configurations for this project
4. `/health` health check module for every service integrated
5. `/jobs` cron job or schedule task
6. `/language` json languages
7. `/migration` migrate all init data
8. `/modules` other modules based on service based on project
9. `/router` endpoint router. `Controller` will put in this

### Module structure

Full structure of module

```txt
.
└── module1
    ├── abstracts
    ├── constants // constant like enum, static value, status code, etc
    ├── controllers // business logic for rest api
    ├── decorators // warper decorator, custom decorator, etc
    ├── dtos // request validation
    ├── docs // swagger or OpenAPI 3
    ├── errors // custom error
    ├── factories // custom factory
    ├── filters // custom filter 
    ├── guards // guard validate
    ├── indicators // custom health check indicator
    ├── interceptors // custom interceptors
    ├── interfaces
    ├── middleware
    ├── pipes
    ├── repository
        ├── entities // database entities
        ├── repositories // database repositories
        └── module1.repository.module.ts
    ├── serializations // response serialization
    ├── services
    ├── tasks // task for cron job
    └── module1.module.ts
```

### Response Structure

This section will describe the structure of the response test.

#### Response Default

> _metadata useful when we need to give the frontend some information

Default response for the response

```ts
export class ResponseMetadataSerialization {
    languages: string[];
    timestamp: number;
    timezone: string;
    requestId: string;
    path: string;
    version: string;
    repoVersion: string;
    [key: string]: any;
}

export class ResponseDefaultSerialization {
    statusCode: number;
    message: string;
    _metadata?: ResponseMetadataSerialization;
    data?: Record<string, any>;
}
```

#### Response Paging

> _metadata useful when we need to give the frontend some information

Default response for pagination.

```ts
export class RequestPaginationSerialization {
    search: string;
    filters: Record<
        string,
        string | number | boolean | Array<string | number | boolean>
    >;
    page: number;
    perPage: number;
    orderBy: string;
    orderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE;
    availableSearch: string[];
    availableOrderBy: string[];
    availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[];
}

export class ResponsePaginationSerialization extends RequestPaginationSerialization {
    total: number;
    totalPage: number;
}

export class ResponsePaginationCursorSerialization {
    nextPage: string;
    previousPage: string;
    firstPage: string;
    lastPage: string;
}

export interface ResponsePagingMetadataSerialization
    extends ResponseMetadataSerialization {
    cursor: ResponsePaginationCursorSerialization;
    pagination: ResponsePaginationSerialization;
}

export class ResponsePagingSerialization {
    statusCode: number;
    message: string;
    _metadata: ResponsePagingMetadataSerialization;
    data: Record<string, any>[];
}

```


## Prerequisites

Let's assume that everyone who comes here is **`programmer with intermediate knowledge`** and we also need to understand more before we begin in order to reduce the knowledge gap.

1. Understand [NestJs Fundamental][ref-nestjs], Main Framework. NodeJs Framework with support fully TypeScript.
2. Understand[Typescript Fundamental][ref-typescript], Programming Language. It will help us to write and read the code.
3. Understand [ExpressJs Fundamental][ref-nodejs], NodeJs Base Framework. It will help us in understanding how the NestJs Framework works.
4. Understand what NoSql is and how it works as a database, especially [MongoDB.][ref-mongodb]
5. Understand Repository Design Pattern or Data Access Object Design Pattern. It will help to read, and write the source code
6. Understand The SOLID Principle and KISS Principle for better write the code.
7. Optional. Understand Microservice Architecture, Clean Architecture, and/or Hexagonal Architecture. It can help to serve the project.
8. Optional. Understanding [The Twelve Factor Apps][ref-12factor]. It can help to serve the project.
9. Optional. Understanding [Docker][ref-docker]. It can help to run the project.

## Getting Started

Before start, we need to install some packages and tools.
The recommended version is the LTS version for every tool and package.

> Make sure to check that the tools have been installed successfully.

1. [NodeJs][ref-nodejs]
2. [MongoDB][ref-mongodb]
3. [Yarn][ref-yarn]
4. [Git][ref-git]

### Install Dependencies

This project needs some dependencies. Let's go install it.

```bash
yarn install
```

### Create environment

Make your own environment file with a copy of `env.example` and adjust values to suit your own environment.

```bash
cp .env.example .env
```

To know the details, you can read the documentation. [Jump to document section](#documentation)

### Test

The project only provide `unit testing`.

```bash
yarn test
```

## Run Project

Finally, Cheers 🍻🍻 !!! you passed all steps.

Now you can run the project.

```bash
yarn start:dev
```

## Run Project with Docker

For docker installation, we need more tools to be installed in our instance.

1. [Docker][ref-docker]
2. [Docker-Compose][ref-dockercompose]

Then run

```bash
docker-compose up -d
```

After all containers up, we not finish yet. We need to manual configure mongodb as replication set.
In this case primary will be `mongo1`

1. In root dir, Enter the `mongo1` container
   
    ```bash
    docker exec -it mongo1 mongosh
    ```

2. In mongo1 container, tell the primary to be as replication set
   
    ```js
    rs.initiate({_id:"rs0", members: [{_id:0, host:"mongo1:27017", priority:3}, {_id:1, host:"mongo2:27017", priority:2}, {_id:2, host:"mongo3:27017", priority:1}]}, { force: true })
    ```

    will return response `{status: ok}`
    
    then exit the container
    
    ```bash
    exit
    ```

3. In root dir, adjust env file
   
    ```env
    ...

    DATABASE_HOST=mongodb://mongo1:27017,mongo2:27017,mongo3:27017
    DATABASE_NAME=relik-[env]
    DATABASE_USER=
    DATABASE_PASSWORD=
    DATABASE_DEBUG=false
    DATABASE_OPTIONS=replicaSet=rs0&retryWrites=true&w=majority

    ...
    ```

4. In root dir, Restart the service container

    ```bash
    docker restart service
    ```

## Database Migration

> The migration will do data seeding to MongoDB. Make sure to check the value of the `DATABASE_` prefix in your`.env` file.

The Database migration used [NestJs-Command][ref-nestjscommand]

For seeding

```bash
yarn seed
```

For remove all data do

```bash
yarn rollback
```

## API Reference

You can check The ApiSpec after running this project. [here][api-reference-docs]

### User Test

1. Super Admin
   - email: `superadmin@mail.com`
   - password: `aaAA@@123444`
2. Admin
   - email: `admin@mail.com`
   - password: `aaAA@@123444`
3. Member
   - email: `member@mail.com`
   - password: `aaAA@@123444`
4. User
   - email: `user@mail.com`
   - password: `aaAA@@123444`

## Documentation

> Ongoing update

## Adjust Mongoose Setting

> Optional, if your mongodb version is < 5

Go to file `src/common/database/services/database.options.service.ts` and add `useMongoClient` to `mongooseOptions` then set value to `true`.

```typescript
const mongooseOptions: MongooseModuleOptions = {
    uri,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    useMongoClient: true // <--- add this
};
```

## License

Distributed under [MIT licensed][license].

## Contribute

How to contribute in this repo

1. Fork the project with click `Fork` button of this repo.
2. Clone the fork project

    ```bash
    git clone "url you just copied"
    ```

3. Make necessary changes and commit those changes
4. Commit the changes

    ```bash
    git commit -m "your message"
    ```

5. Push changes to fork project

    ```bash
    git push origin -u main
    ```

6. Back to browser, goto your fork repo github. Then, click `Compare & pull request`

If your code behind commit with the original, please update your code and resolve the conflict. Then, repeat from number 6.

### Rule

* Avoid Circular Dependency
* Consume component based / modular folder structure, and repository design pattern
* Always make `service` for every module is independently.
* Do not put `controller` into service modules, cause this will break the dependency. Only put the controller into `router` and then inject the dependency.
* Put the config in `/configs` folder, and for dynamic config put as `environment variable`
* `CommonModule` only for main package, and put the module that related of service/project into `/src/modules`. So, if we want to clear the unnecessary module, we just need to delete the `src/modules/**`
* If there a new service in CommonModule. Make sure to create the unit test in `/unit`.

<!-- Reference -->
[ref-nestjs]: http://nestjs.com
[ref-mongoose]: https://mongoosejs.com
[ref-mongodb]: https://docs.mongodb.com/
[ref-nodejs]: https://nodejs.org/
[ref-typescript]: https://www.typescriptlang.org/
[ref-docker]: https://docs.docker.com
[ref-dockercompose]: https://docs.docker.com/compose/
[ref-yarn]: https://yarnpkg.com
[ref-12factor]: https://12factor.net
[ref-nestjscommand]: https://gitlab.com/aa900031/nestjs-command
[ref-jwt]: https://jwt.io
[ref-jest]: https://jestjs.io/docs/getting-started
[ref-git]: https://git-scm.com

<!-- API Reference -->
[api-reference-docs]: http://localhost:3000/docs
