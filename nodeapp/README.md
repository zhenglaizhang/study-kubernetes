
##

```
docker build -t simple-node .
docker run --rm -p 3000:3000 simple-node
```

## Docker Image Format

- de facto standard
- overlay file system
  - aufs
  - overlay
  - overlay2
- container laying
- directed acyclic graph
- container root filesystem and configuration file are typically bundled using the docker image format
- two main categories of containers
  - system containers
  - application containers