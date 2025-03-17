<script lang="ts">
    import logo from '$lib/assets/livehub_small.png';
    interface Props {
        class?: string;
        size?: number;
    }

    const {class: className, size = 32}: Props = $props();
</script>
<img src="{logo}" alt="LiveHub" class={className} width={size} height={size} draggable="false" />
