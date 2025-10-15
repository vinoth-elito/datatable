
function initializeDataTables() {
    $(".data__table__container").each(function () {
        const $container = $(this);
        const $table = $container.find("table");
        const $tbody = $table.find("tbody");
        const $tableScroll = $table.find("tbody");
        const originalRows = $tbody.find("tr").toArray();
        let rows = [...originalRows];
        const $searchInput = $container.find(".table__search");
        const $searchSubmit = $container.find(".search__submit__section");
        const $pagination = $container.find(".pagination");
        const $entriesSelect = $container.find(".table__row__count");
        const $rowCountDropdown = $container.find(".table__row__count");
        const $rowCountSelected = $rowCountDropdown.find(".count__selected");
        const $rowCountOptions = $rowCountDropdown.find(".table__row__options li");
        const $refreshBtn = $container.find(".table__refresh");
        const $tabs = $container.find(".tab");
        const $indicator = $container.find(".tab-indicator");
        const $search = $container.find(".loader-search-icon");
        const $dropdown = $container.find(".custom-dropdown");
        const $selected = $dropdown.find(".dropdown-selected");
        const $options = $dropdown.find(".dropdown-options li");
        const $tableFooter = $container.find(".table__footer");
        let currentPage = 1;
        let sortKey = null;
        let sortAsc = true;
        let currentStatus = "All";
        // let perPage = parseInt($entriesSelect.val());
        let $defaultOption = $rowCountOptions.filter(".active").first();
        if (!$defaultOption.length) {
            $defaultOption = $rowCountOptions.first();
            $defaultOption.addClass("active");
        }
        let perPage = parseInt($defaultOption.data("value"), 10);
        let lastPerPage = perPage;
        $rowCountSelected.find("span").text(perPage);
        currentPage = 1;
        function showLoaderRow(message) {
            $tbody.find("tr.data-row").hide();
            if (!$tbody.find(".loader-row").length) {
                $tbody.append(`
                            <tr class="loader-row">
                                <td colspan="${$table.find("th").length}" class="text-center">
                                    <div class="loader__row__info">
                                        <div class="loader__row__info--spinner">
                                            <span class="loader-spinner"></span> ${message}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        `);
            }
        }
        function removeLoaderRow() {
            $tbody.find(".loader-row").remove();
        }
        $rowCountSelected.on("click", function (e) {
            e.stopPropagation();
            $(".table__row__count").not($rowCountDropdown).removeClass("open")
                .find(".table__row__options").hide();
            $rowCountDropdown.toggleClass("open");
            $rowCountDropdown.find(".table__row__options").toggle();
        });
        $rowCountOptions.on("click", function (e) {
            e.stopPropagation();
            const $thisDropdown = $(this).closest(".table__row__count");
            $(".table__row__count").not($thisDropdown).removeClass("open")
                .find(".table__row__options").hide();

            const value = parseInt($(this).data("value"), 10);
            perPage = value;
            lastPerPage = value;
            $thisDropdown.find(".count__selected span").text(value);
            $thisDropdown.find(".table__row__options li").removeClass("active");
            $(this).addClass("active");
            $thisDropdown.removeClass("open");
            $thisDropdown.find(".table__row__options").hide();
            currentPage = 1;
            const $activeTab = $tabs.filter(".active");
            let activeStatus = $activeTab.data("value") || "All";
            let rowsToRender;
            if (searchActive && currentFilteredRows) {
                rowsToRender = currentFilteredRows;
            } else if (activeStatus === "All") {
                rowsToRender = $table.find("tr.data-row");
            } else {
                const statusColIndex = $table.find("th").filter(function () {
                    return $(this).text().trim() === "Transaction Status";
                }).index();
                rowsToRender = $table.find("tr.data-row").filter(function () {
                    return $(this).children().eq(statusColIndex).text().trim() === activeStatus;
                });
            }
            renderTable(rowsToRender);
            adjustTbodyScroll($tableScroll);
        });
        $(document).on("click", function () {
            $(".table__row__count").removeClass("open");
            $(".table__row__options").hide();
        });
        $selected.on("click", function (e) {
            e.stopPropagation();
            const $container = $(this).closest(".data__table__container");
            const $dropdown = $container.find(".custom-dropdown");
            $(".data__table__container").not($container).each(function () {
                $(this).find(".custom-dropdown").removeClass("open").find(".dropdown-options").hide();
            });
            $dropdown.find(".dropdown-options").toggle();
            if ($dropdown.find(".dropdown-options").is(":visible")) {
                $dropdown.addClass("open");
            } else {
                $dropdown.removeClass("open");
            }
            $container.find(".search-container").removeClass("show");
        });
        $options.on("click", function (e) {
            e.stopPropagation();
            const $container = $(this).closest(".data__table__container");
            const $dropdown = $container.find(".custom-dropdown");
            const $selected = $dropdown.find(".dropdown-selected");
            const $options = $dropdown.find("li");
            const text = $(this).text();
            $selected.find("span").text(text);
            $options.removeClass("active");
            $(this).addClass("active");
            $dropdown.find(".dropdown-options").hide();
            $dropdown.removeClass("open");
        });
        $(document).on("click", function () {
            $(".data__table__container").each(function () {
                const $dropdown = $(this).find(".custom-dropdown");
                $dropdown.removeClass("open").find(".dropdown-options").hide();
            });
        });
        $(document).on("click", function () {
            if ($dropdown.find(".dropdown-options").is(":visible")) {
                $dropdown.find(".dropdown-options").hide();
                $dropdown.removeClass("open");
            }
        });
        $search.on("click", function (e) {
            const $container = $(this).parents(".data__table__container");
            const $dropdown = $container.find(".custom-dropdown");
            const $table = $container.find("table");
            $dropdown.find(".dropdown-options").hide();
            $dropdown.removeClass("open");
            $(".data__table__container").not($container).each(function () {
                $(this).find(".search-container").removeClass("show");
            });
            const $searchContainer = $container.find(".search-container");
            $searchContainer.toggleClass("show");
            if ($searchContainer.hasClass("show")) {
                $searchContainer.find('.search__section').fadeIn();
                $searchContainer.find(".table__search").focus();
            }
            $table.find("tr.show__div").removeClass("show");
            $table.find("tr.data-row").removeClass("active-row");
            e.stopPropagation();
        });
        $(document).on("click", function (e) {
            $(".data__table__container").each(function () {
                const $container = $(this);
                const $searchContainer = $container.find(".search-container");
                if (!$searchContainer.is(e.target) && $searchContainer.has(e.target).length === 0) {
                    $searchContainer.removeClass("show");
                }
            });
        });
        $(".table__search").on("click", function (e) {
            e.stopPropagation();
        });
        let currentFilteredRows = null;
        let searchActive = false;
        $searchInput.on("input", function () {
            const query = $(this).val().trim().toLowerCase();
            $tbody.find(".no-data-row, .loader-row").remove();
            $tbody.empty().append(originalRows);
            const $allRows = $tbody.find("tr.data-row");
            $allRows.hide();
            if (query.length > 0) {
                showLoaderRow(`Searching for "${query}"...`);
            } else {
                showLoaderRow("Please wait, showing all data...");
            }
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => {
                removeLoaderRow();
                const statusColIndex = $table.find("th").filter(function () {
                    return $(this).text().trim() === "Transaction Status";
                }).index();
                const searchedRows = $allRows.filter(function () {
                    return $(this).text().toLowerCase().includes(query);
                });
                $searchSubmit.prop("disabled", true);
                $tbody.find(".no-data-row").remove();
                let $activeTab;
                if (searchedRows.length === 0 && query.length > 0) {
                    const colspan = $table.find("th").length;
                    $tbody.empty().append(`
                                <tr class="no-data-row">
                                    <td colspan="${colspan}" class="text-center">
                                        <div class="no__data__table">Sorry, no data found.</div>
                                    </td>
                                </tr>
                            `);
                    $tableFooter.slideUp();
                    $tabs.removeClass("active");
                    $activeTab = $tabs.filter('[data-value="All"]').addClass("active");
                } else {
                    $tableFooter.slideDown();
                    const uniqueStatuses = [...new Set(searchedRows.map(function () {
                        return $(this).children().eq(statusColIndex).text().trim();
                    }).get())];

                    let filteredRows;
                    if (uniqueStatuses.length === 1) {
                        const targetStatus = uniqueStatuses[0];
                        $tabs.removeClass("active");
                        $activeTab = $tabs.filter(`[data-value="${targetStatus}"]`).addClass("active");
                        filteredRows = searchedRows.filter(function () {
                            return $(this).children().eq(statusColIndex).text().trim() === targetStatus;
                        });
                    } else {
                        $tabs.removeClass("active");
                        $activeTab = $tabs.filter('[data-value="All"]').addClass("active");
                        filteredRows = searchedRows;
                    }
                    renderTable(filteredRows);
                }
                moveIndicator($activeTab);
            }, 200);
        });
        $searchSubmit.prop("disabled", $searchInput.val().trim() === "");
        $searchSubmit.on("click", function (e) {
            e.preventDefault();
            const $container = $searchInput.closest(".data__table__container");
            const $allRows = $table.find("tr.data-row");
            let query = $searchSubmit.data("enter-query") || $searchInput.val().trim();
            $searchSubmit.removeData("enter-query");
            query = query.toLowerCase();
            currentPage = 1;
            $search.find(".searched-text").remove();
            $searchInput.val("");
            let searchedRows;
            if (query.length > 0) {
                searchedRows = $allRows.filter(function () {
                    return $(this).text().toLowerCase().includes(query);
                });
                $search.append(`<span class="searched-text" style="margin-left:6px; font-size:13px; color:#555;">${query}</span>`);
            } else if (currentFilteredRows && currentFilteredRows.length) {
                searchedRows = currentFilteredRows;
            } else {
                searchedRows = $allRows;
            }
            if (!searchedRows.length) {
                const colspan = $table.find("th").length;
                $tbody.empty().append(`
                            <tr class="no-data-row">
                                <td colspan="${colspan}" class="text-center">
                                    <div class="no__data__table">Sorry, no data found.</div>
                                </td>
                            </tr>
                        `);
                $tableFooter.slideUp();
                $tabs.removeClass("active");
                moveIndicator($tabs.filter('[data-value="All"]').addClass("active"));
                return;
            }
            currentFilteredRows = searchedRows;
            searchActive = query.length > 0;
            const statusColIndex = $table.find("th").filter(function () {
                return $(this).text().trim() === "Transaction Status";
            }).index();
            const uniqueStatuses = [...new Set(searchedRows.map(function () {
                return $(this).children().eq(statusColIndex).text().trim();
            }).get())];
            let filteredRows;
            let $activeTab;
            if (uniqueStatuses.length === 1) {
                const targetStatus = uniqueStatuses[0];
                $tabs.removeClass("active");
                $activeTab = $tabs.filter(`[data-value="${targetStatus}"]`).addClass("active");
                filteredRows = searchedRows.filter(function () {
                    return $(this).children().eq(statusColIndex).text().trim() === targetStatus;
                });
            } else {
                $tabs.removeClass("active");
                $activeTab = $tabs.filter('[data-value="All"]').addClass("active");
                filteredRows = searchedRows;
            }
            renderTable(filteredRows);
            moveIndicator($activeTab);
            $container.find(".search-container").removeClass("show");
            $tabs.removeClass("disabled").css("pointer-events", "");
            $searchSubmit.prop("disabled", true);
        });
        $searchInput.on("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                const query = $(this).val().trim();
                if (query !== "") {
                    $searchSubmit.data("enter-query", query);
                }
                $searchSubmit.trigger("click");
            }
        });
        function moveIndicator($activeTab) {
            const offsetLeft = $activeTab.position().left;
            const width = $activeTab.outerWidth();
            $indicator.css({
                transform: `translateX(${offsetLeft}px)`,
                width: `${width}px`
            });
        }
        moveIndicator($(".tabs-container .tab.active"));
        $tabs.on("click", function () {
            const $tab = $(this);
            if ($tab.hasClass("disabled")) return;
            const $tabContainer = $tab.closest(".tabs-container");
            const tableId = $tabContainer.data("table");
            const $table = $("#" + tableId);
            const $tbody = $table.find("tbody");
            const filterValue = $tab.data("value");
            const tabName = $tab.text().trim();
            $tabContainer.find(".tab").addClass("disabled").css("pointer-events", "none");
            $tabContainer.find(".tab").removeClass("active");
            $tab.addClass("active");
            moveIndicator($tab);
            const $allRows = $tbody.find("tr.data-row");
            $allRows.hide().removeClass("visible-row active-row");
            $table.find("tr.show__div").removeClass("show").hide();
            $tbody.find(".no-data-row, .fetching-row").remove();
            const colspan = $table.find("th").length;
            $tbody.append(`
                        <tr class="fetching-row">
                            <td colspan="${colspan}" class="text-center">
                                <div class="no__data__table">We are fetching content for "${tabName}"</div>
                            </td>
                        </tr>
                    `);
            setTimeout(() => {
                $tbody.find(".fetching-row").remove();
                let filteredRows = filterValue === "All"
                    ? $allRows
                    : $allRows.filter(function () {
                        return $(this).find("td[data-value]").data("value") === filterValue;
                    });
                if (filteredRows.length === 0) {
                    $tableFooter.slideUp();
                    $tbody.append(`
                                <tr class="no-data-row">
                                    <td colspan="${colspan}" class="text-center">
                                        <div class="no__data__table">No data available</div>
                                    </td>
                                </tr>
                            `);
                } else {
                    currentPage = 1;
                    renderTable(filteredRows);
                    $tableFooter.slideDown();
                }
                $tabContainer.find(".tab").removeClass("disabled").css("pointer-events", "");
            }, 500);
        });
        $refreshBtn.on("click", function () {
            const $btn = $(this);
            $btn.addClass("refresh-active");
            setTimeout(() => $btn.removeClass("refresh-active"), 300);
            $search.find(".searched-text").remove();
            currentPage = 1;
            $searchInput.val("");
            currentStatus = "All";
            $options.first().trigger("click");
            currentColumnIndex = undefined;
            searchActive = false;
            $tabs.removeClass("active");
            const $allTab = $tabs.filter('[data-value="All"]').first();
            $allTab.addClass("active");
            moveIndicator($allTab);
            const $tbody = $table.find("tbody");
            $table.find("th").removeClass("asc desc");
            $tbody.empty().append(originalRows);
            $table.find("tr.show__div").removeClass("show");
            $table.find("tr.data-row").removeClass("active-row");
            const defaultValue = 5;
            perPage = defaultValue;
            lastPerPage = defaultValue;
            $rowCountOptions.removeClass("active");
            $rowCountOptions.filter(`[data-value='${defaultValue}']`).addClass("active");
            $rowCountSelected.find("span").text(defaultValue);
            currentPage = 1;
            const $wrapper = $table.closest(".data__table__container");
            $wrapper.removeClass("scroll");
            $tbody.css({
                "max-height": "",
                "overflow-y": "",
                "display": ""
            });
            showLoaderRow("Refreshing table...");
            setTimeout(() => {
                removeLoaderRow();
                renderTable();
                $tableFooter.slideDown();

                const visibleRows = $tbody.find("tr.data-row:visible").length;
                if (visibleRows > 10) {
                    $wrapper.addClass("scroll");
                } else {
                    $wrapper.removeClass("scroll");
                }
            }, 800);
            attachAccordion();
        });

        function attachAccordion() {
            $table.find("tr.data-row").off("click").on("click", function () {
                const $row = $(this);
                const $detailRow = $row.next(".show__div");
                if ($detailRow.length) {
                    const isOpen = $detailRow.hasClass("show");
                    $table.find("tr.show__div").not($detailRow).removeClass("show");
                    $table.find("tr.data-row").not($row).removeClass("active-row");
                    if (isOpen) {
                        $detailRow.removeClass("show");
                        $row.removeClass("active-row");
                    } else {
                        $detailRow.addClass("show");
                        $row.addClass("active-row");
                    }
                }
            });
        }
        attachAccordion();
        function renderPagination(filteredRows) {
            var totalRows = filteredRows.length;
            var pageCount = Math.ceil(totalRows / perPage);
            $pagination.empty();
            if (totalRows <= perPage) {
                $pagination.hide();
                return;
            } else {
                $pagination.show();
            }
            var $prev = $("<button>")
                .text("Prev")
                .prop("disabled", currentPage === 1)
                .on("click", function () {
                    if (currentPage > 1) {
                        currentPage--;
                        renderTable(filteredRows);
                    }
                });
            $pagination.append($prev);
            var maxVisible = 5;
            var start = Math.max(1, currentPage - 2);
            var end = Math.min(pageCount, start + maxVisible - 1);
            if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
            if (start > 1) {
                var $first = $("<button>").text("1").on("click", function () {
                    currentPage = 1;
                    renderTable(filteredRows);
                });
                $pagination.append($first);
                if (start > 2) $pagination.append($("<span>").text("..."));
            }
            for (var i = start; i <= end; i++) {
                var $btn = $("<button>")
                    .text(i)
                    .toggleClass("active", i === currentPage)
                    .on("click", (function (page) {
                        return function () {
                            currentPage = page;
                            renderTable(filteredRows);
                        };
                    })(i));
                $pagination.append($btn);
            }
            if (end < pageCount) {
                if (end < pageCount - 1) $pagination.append($("<span>").text("..."));
                var $last = $("<button>").text(pageCount).on("click", function () {
                    currentPage = pageCount;
                    renderTable(filteredRows);
                });
                $pagination.append($last);
            }
            var $next = $("<button>")
                .text("Next")
                .prop("disabled", currentPage === pageCount)
                .on("click", function () {
                    if (currentPage < pageCount) {
                        currentPage++;
                        renderTable(filteredRows);
                    }
                });
            $pagination.append($next);
        }
        function adjustTbodyScroll($tableScroll) {
            const $tbody = $tableScroll;
            const $wrapper = $tbody.closest(".data__table__container");
            const maxRows = 10;

            if ($tbody.find("tr.data-row:visible").length > maxRows) {
                $wrapper.addClass("scroll");
            } else {
                $wrapper.removeClass("scroll");
            }
        }

        $entriesSelect.on("change click", function () {
            perPage = parseInt($(this).val(), 10);
            currentPage = 1;
            const $activeTab = $tabs.filter(".active");
            let activeStatus = $activeTab.data("value");
            if (!activeStatus) activeStatus = "All";
            let rowsToRender;
            if (searchActive && currentFilteredRows) {
                rowsToRender = currentFilteredRows;
            } else if (activeStatus === "All") {
                rowsToRender = $table.find("tr.data-row");
            } else {
                const statusColIndex = $table.find("th").filter(function () {
                    return $(this).text().trim() === "Transaction Status";
                }).index();
                rowsToRender = $table.find("tr.data-row").filter(function () {
                    return $(this).children().eq(statusColIndex).text().trim() === activeStatus;
                });
            }
            renderTable(rowsToRender);
            adjustTbodyScroll($tableScroll);
        });
        // function handleEntriesChange(selectedValue) {
        //     perPage = selectedValue;
        //     currentPage = 1;
        //     currentFilteredRows = null;
        //     searchActive = false;
        //     $tabs.removeClass("active");
        //     const $allTab = $tabs.filter('[data-value="All"]').first();
        //     $allTab.addClass("active");
        //     moveIndicator($allTab);
        //     currentStatus = "All";
        //     currentColumnIndex = undefined;
        //     renderTable();
        //     const $wrapper = $table.closest(".data__table__container");
        //     const visibleRows = $tbody.find("tr.data-row:visible").length;
        //     if (visibleRows > 10) {
        //         $wrapper.addClass("scroll");
        //     } else {
        //         $wrapper.removeClass("scroll");
        //     }
        //     $tableFooter.slideDown();
        // }
        function highlightTabForSearch(filteredRows) {
            const statusIndex = $table.find("th").filter((i, th) => $(th).text().trim() === "Transaction Status").index();
            const statuses = filteredRows.map(r => $(r).children().eq(statusIndex).text().trim());
            const uniqueStatuses = [...new Set(statuses)];
            const activeStatus = uniqueStatuses.length === 1 ? uniqueStatuses[0] : "All";
            $tabs.removeClass("active");
            $tabs.filter(`[data-value="${activeStatus}"]`).addClass("active");
            moveIndicator($tabs.filter(".active"));
        }
        function sortTableWithDetails($table, th) {
            const index = th.cellIndex;
            const sortType = th.dataset.sortType || 'string';
            const currentDir = th.dataset.sortDir || 'asc';
            const newDir = currentDir === 'asc' ? 'desc' : 'asc';
            const rowGroups = [];
            $table.find('tbody tr.data-row').each(function () {
                const $row = $(this);
                const $detail = $row.next('.show__div');
                rowGroups.push({ main: $row, detail: $detail.length ? $detail : null });
            });
            rowGroups.sort((a, b) => {
                let aText = a.main.children().eq(index).text().trim();
                let bText = b.main.children().eq(index).text().trim();
                let cmp = 0;
                if (sortType === 'number') cmp = parseFloat(aText) - parseFloat(bText);
                else if (sortType === 'date') cmp = new Date(aText) - new Date(bText);
                else cmp = aText.localeCompare(bText);
                return newDir === 'asc' ? cmp : -cmp;
            });
            const $tbody = $table.find('tbody');
            rowGroups.forEach(group => {
                $tbody.append(group.main);
                if (group.detail) $tbody.append(group.detail);
            });
            $table.find('thead th').removeClass('asc desc').removeAttr('data-sort-dir');
            $(th).addClass(newDir).attr('data-sort-dir', newDir);
        }
        $('table').each(function () {
            const $table = $(this);
            $table.find('thead th').off('click').on('click', function () {
                sortTableWithDetails($table, this);
            });
        });
        function getTableData($table) {
            let tableData = [];
            $table.find('tbody tr.data-row').each(function () {
                tableData.push($(this).clone());
            });
            return tableData;
        }
        function renderTable(filteredRowsOverride) {
            var $rows = $table.find("tr.data-row");
            var $tbody = $table.find("tbody");
            $rows.hide().removeClass("active-row");
            $table.find("tr.show__div").removeClass("show").hide();
            $tbody.find(".no-data-row").remove();
            var filteredRows;
            if (filteredRowsOverride) {
                filteredRows = filteredRowsOverride;
            } else {
                filteredRows = $rows.filter(function () {
                    if (currentStatus === "All" || currentColumnIndex === -1) return true;
                    return $(this).find("td").eq(currentColumnIndex).text().trim() === currentStatus;
                });
            }
            if (filteredRows.length <= perPage) {
                filteredRows.show();
                filteredRows.each(function () {
                    var $nextDiv = $(this).next("tr.show__div");
                    if ($nextDiv.length) $nextDiv.show();
                });
                renderPagination(filteredRows);
                return;
            }
            var startIndex = (currentPage - 1) * perPage;
            var rowsToShow = $(filteredRows).slice(startIndex, startIndex + perPage);
            rowsToShow.show();
            rowsToShow.each(function () {
                var $nextDiv = $(this).next("tr.show__div");
                if ($nextDiv.length) $nextDiv.show();
            });
            renderPagination(filteredRows);
            attachAccordion();
        }
        renderTable();
    });
}
$(document).ready(function () {
    initializeDataTables();
});