# Containerized Web App on AKS

## Summary
A Node.js (Express) web app containerized with Docker, stored in Azure Container Registry, and deployed to AKS with a LoadBalancer service and CPU-based HPA.

## Deployment details
| Item | Value |
|---|---|
| Public endpoint | http://20.255.188.2 |
| Resource group | rg-aks-lab |
| Region | East Asia |
| ACR | acrwebappas.azurecr.io |
| Image | acrwebappas.azurecr.io/webapp:v1 |
| AKS cluster | aks-webapp-lab (Kubernetes 1.36) |
| Node pool | nodepool1, Standard_D2s_v4, 2 nodes |
| Service | webapp-svc, LoadBalancer, port 80 -> 3000 |
| Baseline replicas | 2 |
| Resources | requests 100m CPU / 128Mi, limits 250m CPU / 256Mi |

## HPA configuration
- Target: CPU utilization 50%
- Min replicas: 2, Max replicas: 5
- Test: ran a load generator against `/load`. CPU reached 102% and the HPA scaled from 2 to 5 pods within about 1 minute.
- Pods spread across both nodes (2 on one, 3 on the other).

## Files
- `app/server.js`, `app/package.json`: web app
- `Dockerfile`: container image definition
- `k8s/deployment.yaml`, `k8s/service.yaml`, `k8s/hpa.yaml`: Kubernetes manifests

## Build and deploy
    az acr build -r acrwebappas -t webapp:v1 .
    az aks get-credentials -g rg-aks-lab -n aks-webapp-lab
    kubectl apply -f k8s/
    kubectl get pods,svc,hpa

## Notes
- The image was built with `az acr build` (ACR Tasks), so no local Docker was needed.
- The cluster was created with Azure CLI using `Standard_D2s_v4`, because B-series and v5 sizes were blocked by quota on the Azure for Students subscription.

## Command cheat sheet
| Task | Command |
|---|---|
| Build image in ACR | `az acr build -r acrwebappas -t webapp:v1 .` |
| List image tags | `az acr repository show-tags -n acrwebappas --repository webapp -o table` |
| Get AKS credentials | `az aks get-credentials -g rg-aks-lab -n aks-webapp-lab` |
| Apply manifests | `kubectl apply -f k8s/` |
| Pods / services / HPA | `kubectl get pods,svc,hpa` |
| Pod details | `kubectl describe pod <pod>` |
| Pod logs | `kubectl logs <pod>` |
| Update image | `kubectl set image deployment/webapp webapp=<image>:v2` |
| Rollback | `kubectl rollout undo deployment/webapp` |# aks-webapp
