# 1 完整的服务器部署

## 1.1 部署 SSL 证书

我们通过 acme.sh 来获得免费的通配符证书

### 1.1.1 安装 acme.sh

```bash
curl https://get.acme.sh | sh -s email=my@example.com
source ~/.bashrc
```

### 1.1.2 提交泛域名&DNS 验证

```bash
acme.sh --issue --dns -d sztulives.cn -d *.sztulives.cn --yes-I-know-dns-manual-mode-enough-go-ahead-please
```

此时的输出大概是这样的，从中取出 TXT 记录，添加到 DNS 服务器中。

```bash
[Sat Feb 25 22:29:18 CST 2023] Using CA: https://acme.zerossl.com/v2/DV90
[Sat Feb 25 22:29:18 CST 2023] Create account key ok.
[Sat Feb 25 22:29:18 CST 2023] No EAB credentials found for ZeroSSL, let's get one
[Sat Feb 25 22:29:22 CST 2023] Registering account: https://acme.zerossl.com/v2/DV90
[Sat Feb 25 22:29:31 CST 2023] Registered
[Sat Feb 25 22:29:31 CST 2023] ACCOUNT_THUMBPRINT='yyyyyyyyyyyyyyyyyyyyyy'
[Sat Feb 25 22:29:31 CST 2023] Creating domain key
[Sat Feb 25 22:29:31 CST 2023] The domain key is here: /root/.acme.sh/sztulives.cn_ecc/sztulives.cn.key
[Sat Feb 25 22:29:31 CST 2023] Multi domain='DNS:sztulives.cn,DNS:*.sztulives.cn'
[Sat Feb 25 22:29:31 CST 2023] Getting domain auth token for each domain
[Sat Feb 25 22:29:43 CST 2023] Getting webroot for domain='sztulives.cn'
[Sat Feb 25 22:29:43 CST 2023] Getting webroot for domain='*.sztulives.cn'
[Sat Feb 25 22:29:43 CST 2023] Add the following TXT record:
[Sat Feb 25 22:29:43 CST 2023] Domain: '_acme-challenge.sztulives.cn'
[Sat Feb 25 22:29:43 CST 2023] TXT value: 'xxxxxxxxxxxxxxxxxxxxxxxxxx'
[Sat Feb 25 22:29:43 CST 2023] Please be aware that you prepend _acme-challenge. before your domain
[Sat Feb 25 22:29:43 CST 2023] so the resulting subdomain will be: _acme-challenge.sztulives.cn
[Sat Feb 25 22:29:43 CST 2023] Add the following TXT record:
[Sat Feb 25 22:29:43 CST 2023] Domain: '_acme-challenge.sztulives.cn'
[Sat Feb 25 22:29:43 CST 2023] TXT value: 'xxxxxxxxxxxxxxxxxxxxxxxxxx'
[Sat Feb 25 22:29:43 CST 2023] Please be aware that you prepend _acme-challenge. before your domain
[Sat Feb 25 22:29:43 CST 2023] so the resulting subdomain will be: _acme-challenge.sztulives.cn
[Sat Feb 25 22:29:43 CST 2023] Please add the TXT records to the domains, and re-run with --renew.
[Sat Feb 25 22:29:43 CST 2023] Please add '--debug' or '--log' to check more details.
[Sat Feb 25 22:29:43 CST 2023] See: https://github.com/acmesh-official/acme.sh/wiki/How-to-debug-acme.sh
```

### 1.1.3 RENEW

Cert success 代表证书已经成功生成，可以通过以下命令来续期

```bash
acme.sh --renew -d sztulives.cn -d *.sztulives.cn --yes-I-know-dns-manual-mode-enough-go-ahead-please
```

### 1.1.4 证书转换

```bash
acme.sh --install-cert -d sztulives.cn -d *.sztulives.cn \
--key-file       /etc/ssl/private/sztulives.cn.key \
--fullchain-file /etc/ssl/certs/sztulives.cn.pem
```

## 1.2 build docker image

### 1.2.1 .env

在根目录创建并写入.env 文件

### 1.2.2 build

```bash
npm run docker:build
```

## 1.3 start

```bash
npm run docker:start
```

## 1.4 初始化 MySQL

```bash
docker
```
