## Overview
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


### kubectl

- kubectl -> master -> controller manager | scheduler -> nodes

```
k version
k cluster-info
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