SHELL  := /bin/bash

#COLORS
RED    := $(shell tput -Txterm setaf 1)
GREEN  := $(shell tput -Txterm setaf 2)
WHITE  := $(shell tput -Txterm setaf 7)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

.PHONY: help
.DEFAULT_GOAL := help

help:
	@echo '$(WHITE)Comand from devolopment and build: $(RESET):'
	@echo '$(YELLOW)build$(RESET):'
	@echo '  $(GREEN)build   $(RESET) - build environment: dev'
	@echo '$(YELLOW)development$(RESET):'
	@echo '  $(GREEN)dev-test$(RESET) - build app and run test'
	@echo '  $(GREEN)test    $(RESET) - unit-test code'
	@echo '  $(GREEN)watch   $(RESET) - clear, build and watch bot.ts'
	@echo '  $(GREEN)build   $(RESET) - builds new bot'
	@echo '  $(GREEN)clear   $(RED) - очистка папки созданного кода'
	@echo '  $(GREEN)start   $(RESET) - start bot, not watch'
	@echo '  $(GREEN)init    $(RESET) - init npm package'

dev-test: build test

test:
ifndef Dev
	@npm run test
endif

watch: 
ifndef Dev
	@npm run dev
endif

start: 
ifndef Start
	@npm run start
endif

clear: 
ifndef Clear
	@npx gulp clear
endif

build: 
ifndef Build
	@npm run build
endif

init: 
ifndef Build
	@npm i
endif

confirm:
	$(if $(shell read -p "Are you sure $(RED)Yes$(RESET)/$(GREEN)No$(RESET)? " && shopt -s nocasematch && [[ "$$REPLY" =~ "yes" ]] && echo 'yes' ),, $(error $(RED)No$(RESET). ) )
# @echo '$(GREEN)Yes$(RESET).'
