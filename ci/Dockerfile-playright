FROM mcr.microsoft.com/playwright:v1.39.0-jammy
#RUN npm install -g netlify-cli node-jq serve node-jq yerine sadece jq yüklemek istiyoruz. Bunun için hangi linux distribution'da çalıştı-
# mızı bilmemiz gerekli. "-jammy" bize bir ubuntu distribution'da olduğumuzu söylüyor. O zaman da apt paket manejerini kullanıyoruz
RUN npm install -g netlify-cli serve
RUN apt update && apt install jq -y