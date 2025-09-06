# Makefile for pp CLI Tools

# Variables
NAME         = pp
INSTALL_DIR  = /usr/local/bin
REPO_DIR     = $(shell pwd)
NPM          = npm

# Default target: show help
.PHONY: help
help:
	@echo "Makefile for pp CLI Tools"
	@echo ""
	@echo "Usage:"
	@echo "  make install    Install the pp script to $(INSTALL_DIR)"
	@echo "  make uninstall  Remove the pp script from $(INSTALL_DIR)"
	@echo "  make deps       Install project dependencies"
	@echo "  make watch-activity Run the activity watcher script"
	@echo ""

# Install dependencies
.PHONY: deps
deps:
	@$(NPM) install

# Install the script to /usr/local/bin
.PHONY: install
install: deps
	@echo "Installing $(NAME) to $(INSTALL_DIR)..."
	@sed 's|@@REPO_DIR@@|$(REPO_DIR)|g' ./scripts/pp.sh > $(NAME)
	@chmod +x $(NAME)
	@sudo mv $(NAME) $(INSTALL_DIR)/$(NAME)
	@echo "Installation complete! Type 'pp' to use the tool."

# Uninstall the script
.PHONY: uninstall
uninstall:
	@echo "Uninstalling $(NAME) from $(INSTALL_DIR)..."
	@sudo rm -f $(INSTALL_DIR)/$(NAME)
	@echo "Uninstallation complete."

# Watch activity
.PHONY: watch-activity
watch-activity:
	@./scripts/watch-activity.sh

