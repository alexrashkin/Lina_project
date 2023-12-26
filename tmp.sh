#!/bin/bash
curl 'http://localhost:8000/api/works/' \
  -H 'Accept: */*' \
  -H 'Accept-Language: ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: csrftoken=uTw8lZsjqND1nTe3Du5jsG855r8c1MugEOaRh7Js2iyh3gR3iTtVFAPqGiOJswEG; sessionid=2spekruom8zjde4a4rxujyjl0yegkiex' \
  -H 'Origin: http://localhost:8000' \
  -H 'Referer: http://localhost:8000/works/create' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36' \
  -H 'authorization: Token 4cecacd583888e01673545e8f953883d2f29ba57' \
  -H 'content-type: application/json' \
  -H 'sec-ch-ua: "Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  --data-binary "@./req_data" \
  --compressed > out.html