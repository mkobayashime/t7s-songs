eslint = yarn eslint --ignore-path .gitignore
prettier = yarn prettier --ignore-path .gitignore
ts-node = node --loader ts-node/esm

install:
	yarn

lint: install
	$(eslint) .

lint.fix: install
	$(eslint) --fix .

format: install
	$(prettier) --write .

format.check: install
	$(prettier) --check .

docgen.offVocal: install
	$(ts-node) src/offVocal.ts
	@make format

docgen: docgen.offVocal
