git checkout master
git branch -D demo
git checkout -b demo
rm -rf ./dist ./docs
yarn && yarn run build
mv dist docs
git add .
git commit -am 'demo'
git push -u origin demo -f
git checkout -
rm -rf ./dist ./docs
