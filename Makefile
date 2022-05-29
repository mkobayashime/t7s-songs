eslint = yarn eslint --ignore-path .gitignore
prettier = yarn prettier --ignore-path .gitignore
ts-node = node --loader ts-node/esm

node_modules: package.json yarn.lock
	yarn
	@touch node_modules

lint: node_modules
	$(eslint) .

lint.fix: node_modules
	$(eslint) --fix .

format: node_modules
	$(prettier) --write .

format.check: node_modules
	$(prettier) --check .

test:
	yarn run jest

test.watch:
	yarn run jest --watch

docgen.offVocal: node_modules
	$(ts-node) src/offVocal.ts
	@make format

docgen: docgen.offVocal
