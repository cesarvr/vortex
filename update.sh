npm run build

branch=$(git branch | grep \* | cut -d ' ' -f2)
dest_folder=../demos-vortex/static

folder=$dest_folder/$branch

mkdir -p $folder 
cp -r index.html dist $folder  

git add .
git commit -m " - updating vortex  time: $(date +"%T") date: $(date +"%d-%m-%Y")"
git push origin $branch

cd ../demos-vortex/
git add .
git commit -m "updated -> $branch" 
git push origin master

cd ../vortex/ 
