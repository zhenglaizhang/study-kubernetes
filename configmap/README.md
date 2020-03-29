```bash
k get configmap # k get cm
k get cm -o yaml
k delete cm app-settings
docker build -t node-configmap:latest .
k create cm app-settings --from-env-file=simple-config.env
k describe cm/app-settings
k apply -f node.deployment.yml
k logs pod/node-configmap-7fb4c4568-mjtbm
k delete -f node.deployment.yml
k delete cm app-settings
```