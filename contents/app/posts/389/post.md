---
title: NATゲートウェイの冗長化
time: 2019-11-28 18:05
tags: ["aws", "terraform"]
---

AWS上にネットワークをゼロから構築する機会があり、NATゲートウェイの冗長化を行った。

# 考え方
* NATゲートウェイがダウンすると、プライベートサブネットにあるサーバーがインターネットに接続できなくなる。
* AZ障害に備えて複数のAZのパブリックサブネットにNATゲートウェイを作る。
* 他のAZでの障害の影響を受けないようにするため、NATゲートウェイは同じAZのプライベートネットワークから参照する。

# 図

```
         public              private
 
     +-[public-1a]-+     +-[private-1a]-+
 1a  |     NAT     | <-> |              |
     +-------------+     +--------------+
     
     +-[public-1c]-+     +-[private-1c]-+
 1c  |     NAT     | <-> |              |
     +-------------+     +--------------+
```

# Terraform
サブネットのAZを固定したいので、データソースを用意しておく。なくてもいいと思う。

```hcl
data "aws_availability_zone" "ap_northeast_1a" {
  name = "ap-northeast-1a"
}

data "aws_availability_zone" "ap_northeast_1c" {
  name = "ap-northeast-1c"
}
```

パブリック/プライベートとAZのペアごとに4つのサブネットにVPCを分割する。`cidrblock`関数を使うとCIDRブロックの計算が簡単になる。

```hcl
resource "aws_subnet" "public_1a" {
  vpc_id            = aws_vpc.default.id
  availability_zone = data.aws_availability_zone.ap_northeast_1a.name
  cidr_block        = cidrsubnet(aws_vpc.default.cidr_block, 2, 0)
}

resource "aws_subnet" "public_1c" {
  vpc_id            = aws_vpc.default.id
  availability_zone = data.aws_availability_zone.ap_northeast_1c.name
  cidr_block        = cidrsubnet(aws_vpc.default.cidr_block, 2, 1)
}

resource "aws_subnet" "private_1a" {
  vpc_id            = aws_vpc.default.id
  availability_zone = data.aws_availability_zone.ap_northeast_1a.name
  cidr_block        = cidrsubnet(aws_vpc.default.cidr_block, 2, 2)
}

resource "aws_subnet" "private_1c" {
  vpc_id            = aws_vpc.default.id
  availability_zone = data.aws_availability_zone.ap_northeast_1c.name
  cidr_block        = cidrsubnet(aws_vpc.default.cidr_block, 2, 3)
}
```

NATゲートウェイをパブリックサブネットごとに作る。

```hcl
resource "aws_eip" "nat_gateway_1a" {
  vpc = true
}

resource "aws_nat_gateway" "nat_gateway_1a" {
  allocation_id = aws_eip.nat_gateway_1a.id
  subnet_id     = aws_subnet.public_1a.id
}

resource "aws_eip" "nat_gateway_1c" {
  vpc = true
}

resource "aws_nat_gateway" "nat_gateway_1c" {
  allocation_id = aws_eip.nat_gateway_1c.id
  subnet_id     = aws_subnet.public_1c.id
}
```

同じAZのNATゲートウェイを参照するようにルートテーブルを作る。

```hcl
resource "aws_route_table" "private_1a" {
  vpc_id = aws_vpc.default.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.private_1a.id
  }
}

resource "aws_route_table" "private_1c" {
  vpc_id = aws_vpc.default.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.private_1c.id
  }
}
```
