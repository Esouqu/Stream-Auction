<script lang="ts">
    import logo from '$lib/assets/livehub.png';
    interface Props {
        class?: string;
        size?: number;
    }

    const {class: className, size = 48}: Props = $props();
</script>
<img src="{logo}" alt="LiveHub" class={className} width={size} height={size/4} draggable="false" />
