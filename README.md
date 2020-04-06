## Overview
- https://github.com/kubernetes/examples
- Pods
- Deployments
  - ReplicaSet
  - zero-downtime deployment
  - automate rollouts/rollbacks
  - **self-healing**
- Services
  - service discovery
  - load balancing
- Storage Options
  - storage orchestration
  - Persistent Volumes
  - Persistent Volume claims
- ConfigMaps (KV) & Secrets

### Why k8s
- automate, scale and manage containized application
- conductor of a container orchestra
- `docker-compose` is not prod ready
- https://kubernetes.io
- Benefits
  - take the responsibility of manage infra and let devs focus on implementing logic
  - orchestrate containers
  - eliminate single point of failure
  - (horizontal) scale containers
  - zero downtime deployments
  - self healing
  - **robust networking and persistent storage options**
- Provides a **declarative** way to define a cluster's state
- key container benefits
  - Eliminate app conflicts 
  - Env consistency
  - Accelerate dev onboarding in case env up and running quickly
  - Ship software faster
- For dev
  - Emulate prod locally
  - move from docker-compose to kubernetes
  - create e2e testing env
  - ensure app scales properly
  - canary testing, AB or blue-green testing


### Local setup
- https://github.com/kubernetes/minikube
- docker-desktop with k8s support checked
- https://github.com/rancher/k3s
- Master + Nodes
- kubelet 
- kube-proxy
- `kubectl`
- Web UI dashboard

## Nodes

- master nodes
  - api server, scheduler...
  - manage the cluster
  - won't schedule work onto master
- worker nodes
  - run containers onside

## Cluster status

- `k version`
- `k get componentstatuses`
- controller manager
- scheduler
  - responsible for placing different pods onto different nodes
- ectd
  - storage where all the api objects are stored

### kubectl

- kubectl -> master -> controller manager | scheduler -> nodes
- namespace
  - default
  - --namespace=mystuff
  - --all-namespaces
- contxt
  - `$HOME/.kube/config`
  - `k config set-context my-context --namespace=mystuff`
  - `k config use-context my-context`

```
k version
k cluster-info
k get nodes
k describe nodes docker-desktop
k get nodes/docker-desktop -o yaml
k get all
k get pods
k get services

k run [container-name] --image=[image-name] # create a deployment for a pod

# by default pod only has internal cluster ip
k port-forward [pod] [ports] # forward a port to allow external access
k expose ...
k create [resource]
k apply
```

- web ui dashboard

```bash
k apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta8/aio/deploy/recommended.yaml
k describe secret -n kube-system
# copy/paste the top most service account token
```
then goto http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

## Pod
- A pod might contain multiple containers: app + sidecar
- A single Pod never span across nodes

```bash
k run 
k create/apply # with yaml


╰─$ k run my-nginx --image=nginx:alpine                                                                                      130 ↵
kubectl run --generator=deployment/apps.v1 is DEPRECATED and will be removed in a future version. Use kubectl run --generator=run-pod/v1 or kubectl create instead.
deployment.apps/my-nginx created
╭─zhenglai@DARINZH-SURFACE /mnt/c/Users/darinzh
╰─$ k get all
NAME                            READY   STATUS              RESTARTS   AGE
pod/my-nginx-6c79cbc966-hp88g   0/1     ContainerCreating   0          3s

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   35m

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/my-nginx   0/1     1            0           3s

NAME                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/my-nginx-6c79cbc966   1         1         0       3s


k delete pod my-nginx-6c79cbc966-hp88g
k port-forward my-nginx-6c79cbc966-dvrcc 8080:80 # external:internal
curl 127.0.0.1:8080

k delete deployment my-nginx
```

### Yaml

```bash
k create -f nginx.pod.yml --dry-run --validate=true
```

### Probe

- **liveness probe**: The kubelet uses liveness probes to know when to restart a container. 
- **readiness probe**: The kubelet uses readiness probes to know when a container is ready to start accepting traffic. A Pod is considered ready when all of its containers are ready. One use of this signal is to control which Pods are used as backends for Services. When a Pod is not ready, it is removed from Service load balancers.
- **startup probe**: The kubelet uses startup probes to know when a container application has started. If such a probe is configured, it disables liveness and readiness checks until it succeeds


### Deployments

- deployment -> replica set -> pod -> container

```bash
k create -f nginx.deployment.yml --save-config
k describe deployment my-nginx
k apply -f ngix.deployment.yml
k get deployment --show-labels
k get deployment -l app=my-nginx
k scale -f nginx.deployment.yml --replicas=4
```

### Zero downtime upgrade
- k8s builtin support, 4 kinds:
- rolling updates
  - default
- blue-green/AB deployments
  - Multiple envs run at the same time, and proven to work as expected, then promote all traffic to the newer one
- canary deployments
  - Very little traffic to new deployments and then proven out by user hiting, then switch all the traffic
- rollbacks
  - tried and didn't work, goto previous version


## Services

### Why
- no ephemeral
- load balaner
- use label to associate with pods
- provide endpoint

### Types

- ClusterIp
- NodePort 
  - https://hackernoon.com/introducing-nodeport-service-in-kubernetes-ear0360s
- LoadBalancer
- ExternalName

```bash
k port-forward pod/my-nginx-77f7664f5f-48mgl 8080:80
k port-forward deployment/my-nginx 8080
```

## Storage

- Volumes
- PersistentVolume -> PersistentVolumesClaim -> volume -> mountPath
- StorageClasses
  - dynamic create persistent volume through storage template

### ConfigMap

- Be accessed from a pod through:
  - Environment variables (key/value)
  - ConfigMap volumes (access as a file)


### Secrets

- https://kubernetes.io/docs/concepts/configuration/secret/#best-practices
- Is it real secret??


```bash
k create secret generic db-passwords --from-literal=db-password='password' --from-literal=db-root-password='password'
k get secrets
k get secrets db-password -o yaml
k get secrets db-passwords -o yaml
```