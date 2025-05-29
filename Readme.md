# Anonymous-ChatApp

It's a simple chat app that uses socket.io in backend and lets ppl anonymously chat with others.

## Getting Started
If you want to run it locally then you can do the following. Ya you must have Docker before doing so.

1. **Pull the images from dockerhub:**   
    ```bash
    docker pull gautamp27/anym-web:localhost
    docker pull gautamp27/anym-server:1.0
    ```
2. **Run the Docker images:**
    ```bash
    docker run -d -p 7000:7000 gautamp27/anym-server:1.0
    docker run -d -p 6000:6000 gautamp27/anym-web:localhost
    ```
3. **Now hit your localhost 6000 port:**
    ```bash
    http://localhost:6000/
    ```

## Incase you want to use the yaml files and run it in your K8s cluster

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/ChatApp-Kubernetes.git
    ```
2. **Run the AnymServerDeployment.yaml and AnymServerService.yaml/AnymServerLoadbalancer.yaml**
    ```bash
    kubectl apply -f AnymServerDeployment.yaml
    kubectl apply -f AnymServerService.yaml ## incase it's for nodeport do this
    kubectl apply -f AnymServerLoadbalancer.yaml ## incase it's loadbalancer
    ```
3. **Now get external Ip and update it in app.tsx**

    For Loadbalancer
    ```bash
    kubectl get svc ## you will get the external IP if you have use loadbalancer
    ```
    For NodePort
    ```bash
    kubectl get pods -o wide ## you will get in which node the pod is running
    kubectl get nodes -o wide ## you will get the node detail and get the external ip
    ```
    update the external IP and port ( 80 if loadbalancer / 30002 if nodeport) with it in app.tsx file in AnonymousChats app.
    ```bash
    const socket = io('http://<external-ip>:<port>')
    ```
4. **Now create a Docker Image and push it in your dockerhub**  
    Create image and push it in dockerhub
    ```bash
    cd Chatapp-kubernetes/AnonymousChats
    docker build -t <YourdockerProfile>/anym-web:latest -f DockerFile .
    docker push <YourdockerProfile>/anym-web:latest
    ```
5. **Update the AnymWebDeployment.yaml file with your image name**
    ```bash
    image: <YourdockerProfile>/anym-web:latest ## update it to this
    ```
6. **Now run the AnymWebDeployment.yaml and AnymWebLoadbalancer.yaml/AnymWebService.yaml**
    ```bash
    kubectl apply -f AnymWebDeployment.yaml
    kubectl apply -f AnymWebService.yaml ## If nodeport
    kubectl apply -f AnymWebLoadbalancer.yaml ## if Loadbalancer required
    ```

7. **Follow similar to 3rd step**
    If nodeport use node external ip and port 30003 and if loadbalancer then use the external ip of loadbalancer service and port 80. And run it in the browser. That's it you are good to go

## Contributing

Contributions are welcome! Please open issues or submit pull requests.

## License

This project is licensed under the MIT License.