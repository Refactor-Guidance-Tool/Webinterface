<script>
    import Button from '../components/Button.svelte';

	export let pageIndex;
    export let numPages;
    export let onPageChanged = function(newPage) {};
</script>

<div class="container">
    <Button extraStyling={"min-width:auto;"} onClick={function() {
            const currentPageIndex = pageIndex; 
            pageIndex = 0;
            if (pageIndex != currentPageIndex) {
                onPageChanged(pageIndex);
            }
        }
    }>&lt;&lt;</Button>
	<Button extraStyling={"min-width:auto;"} onClick={function() {
                const currentPageIndex = pageIndex; 
                pageIndex = Math.max(0, pageIndex - 1);
                if (pageIndex != currentPageIndex) {
                    onPageChanged(pageIndex);
                }
            }
        }>&lt;</Button>
    <span>{pageIndex + 1} / {numPages}</span>
    <Button extraStyling={"min-width:auto; margin-left:5px;"} onClick={function() { 
                const currentPageIndex = pageIndex; 
                pageIndex = Math.min(numPages - 1, pageIndex + 1);
                if (pageIndex != currentPageIndex) {
                    onPageChanged(pageIndex);
                }
            }
        }>&gt;</Button>
    <Button extraStyling={"min-width:auto;"} onClick={function() {
                const currentPageIndex = pageIndex; 
                pageIndex = numPages - 1;
                if (pageIndex != currentPageIndex) {
                    onPageChanged(pageIndex);
                }
            }
        }>&gt;&gt;</Button>
</div>

<style>
	.container {
		display: flex;
        justify-content: center;
	}

    span {
        margin-top: 13px;
    }
</style>