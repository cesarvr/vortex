npm run build

branch=$(git branch | grep \* | cut -d ' ' -f2)
dest_folder=../demos-vortex/static

folder=$dest_folder/$branch

mkdir -p $folder 
cp -r index.html dist $folder  

