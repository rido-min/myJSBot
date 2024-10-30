# Step 1: Login to Azure
#az login

# Step 2: Set Variables
$ACR_NAME=botimages
$RESOURCE_GROUP=test-sdk
$IMAGE_NAME=myjsbot
$IMAGE_TAG=latest

# Step 3: Build Docker Image
#docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

# Step 4: Login to ACR
az acr login --name ${ACR_NAME}

# Step 5: Tag Docker Image
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "loginServer" --output tsv)
#docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${ACR_LOGIN_SERVER}/${IMAGE_NAME}:${IMAGE_TAG}

# Step 6: Push Docker Image
docker push $ACR_LOGIN_SERVER/$IMAGE_NAME:$IMAGE_TAG