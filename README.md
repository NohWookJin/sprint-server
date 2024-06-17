# SPRINT SERVER
🏃 자기개발을 좋아하는 사람을 위한 루틴 관리 서비스 SPRINT, SERVER

## Development
1인 풀스택 개발 프로젝트입니다.

2024년 3월부터 기획, 개발, 운영중입니다. 

## Used Tech Stack
<div style="display:flex;">
  <img src="https://img.shields.io/badge/NestJs-E0234E?style=flat&logo=NestJs&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=white">
  <img src="https://img.shields.io/badge/Passport-34E27A?style=flat&logo=Passport&logoColor=white">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=PostgreSQL&logoColor=white">
  <img src="https://img.shields.io/badge/Amazon%20RDS-527FFF?style=flat&logo=AmazonRDS&logoColor=white">
  <img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=flat&logo=AmazonS3&logoColor=white">
  <img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=flat&logo=AmazonEC2&logoColor=white">
  <img src="https://img.shields.io/badge/PM2-2B037A?style=flat&logo=PM2&logoColor=white">
</div>

## DB ERD
<img width="600" src="https://github.com/NohWookJin/sprint-server/assets/101846817/b8ec4a9c-06b4-4a73-9dbe-b35e7ee5124c">

## How to Start

1. 의존성 설치(yarn)
```
yarn install 
```

2. 실행(로컬, 프로덕션 순서)
```
yarn start:dev
yarn start:prod 
```

3. 마이그레이션 명령어(엔티티 파일 변경사항 반영 및 마이그레이션 파일 생성, 마이그레이션 파일 적용 및 DB 스키마 변경 순서)
```
yarn migration:generate
yarn migration:run
```

4. 빌드
```
yarn build
```

## Client 
👉 [서비스 링크](https://www.sprints.co.kr)에서 반복하는 루틴을 만들고 제공되는 분석을 통해 성장해보세요. 


