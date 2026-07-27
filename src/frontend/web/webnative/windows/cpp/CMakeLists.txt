# 1. Specify the minimum required CMake version
cmake_minimum_required(VERSION 3.20)

# 2. Name the project and set language metadata
project(MyProjectName LANGUAGES CXX)

# 3. Create the executable target from source files
add_executable(MyProjectName main.cpp hello.cpp)
