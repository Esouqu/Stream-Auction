import listAddIcon from '$lib/assets/list_add_icon.svg';
import listAddIconBlack from '$lib/assets/list_add_icon_black.svg';
import startIcon from '$lib/assets/play_icon.svg';
import resetIcon from '$lib/assets/replay_icon.svg';
import upIcon from '$lib/assets/arrow_up_icon.svg';
import downIcon from '$lib/assets/arrow_down_icon.svg';
import pauseIcon from '$lib/assets/pause_icon.svg';
import deleteIcon from '$lib/assets/close_icon.svg';
import deleteIconBlack from '$lib/assets/close_icon_black.svg';
import listRemoveIcon from '$lib/assets/list_remove_icon.svg';
import listRemoveIconBlack from '$lib/assets/list_remove_icon_black.svg';
import infoIcon from '$lib/assets/donators_list_icon.svg';
import plusIcon from '$lib/assets/add_icon.svg';
import plusIconBlack from '$lib/assets/add_icon_black.svg';
import trashcanSweepIcon from '$lib/assets/trashcan_sweep_icon.svg';
import trashcanIconSweepBlack from '$lib/assets/trashcan_sweep_icon_black.svg';
import bombIcon from '$lib/assets/bomb_icon.svg';
import bombIconBlack from '$lib/assets/bomb_icon_black.svg';
import helpIcon from '$lib/assets/help_icon.svg';
import moreIcon from '$lib/assets/more_icon.svg';
import editIcon from '$lib/assets/edit_icon.svg';
import searchIcon from '$lib/assets/search_icon.svg';
import searchIconBlack from '$lib/assets/search_icon_black.svg';
import diceIcon from '$lib/assets/dice_icon.svg';
import diceIconBlack from '$lib/assets/dice_icon_black.svg';
import cycleIcon from '$lib/assets/cycle_icon.svg';
import cycleIconBlack from '$lib/assets/cycle_icon_black.svg';
import visibilityIcon from '$lib/assets/visibility_icon.svg';
import visibilityIconBlack from '$lib/assets/visibility_icon_black.svg';
import visibilityOffIcon from '$lib/assets/visibility_off_icon.svg';
import visibilityOffIconBlack from '$lib/assets/visibility_off_icon_black.svg';
import warningIcon from '$lib/assets/warning_icon.svg';
import rubleIcon from '$lib/assets/currency_ruble_icon.svg';
import stopCycleIcon from '$lib/assets/stop_cycle_icon.svg'
import stopCycleIconBlack from '$lib/assets/stop_cycle_icon_black.svg'


export type iconTypes =
  | 'listAddItem'
  | 'listRemoveItem'
  | 'start'
  | 'reset'
  | 'upArrow'
  | 'downArrow'
  | 'pause'
  | 'delete'
  | 'info'
  | 'plus'
  | 'trashcanSweep'
  | 'visibilityOff'
  | 'visibility'
  | 'cycle'
  | 'stopCycle'
  | 'dice'
  | 'search'
  | 'bomb'
  | 'help'
  | 'emerald'
  | 'more'
  | 'warning'
  | 'ruble'
  | 'edit';

export default function getIcon(icon: iconTypes, color: 'white' | 'black' = 'white') {
  switch (icon) {
    case 'listAddItem':
      return color === 'white' ? listAddIcon : listAddIconBlack;
    case 'listRemoveItem':
      return color === 'white' ? listRemoveIcon : listRemoveIconBlack;
    case 'start':
      return startIcon;
    case 'reset':
      return resetIcon;
    case 'upArrow':
      return upIcon;
    case 'downArrow':
      return downIcon;
    case 'pause':
      return pauseIcon;
    case 'delete':
      return color === 'white' ? deleteIcon : deleteIconBlack;
    case 'info':
      return infoIcon;
    case 'trashcanSweep':
      return color === 'white' ? trashcanSweepIcon : trashcanIconSweepBlack;
    case 'visibility':
      return color === 'white' ? visibilityIcon : visibilityIconBlack;
    case 'help':
      return helpIcon;
    case 'visibilityOff':
      return color === 'white' ? visibilityOffIcon : visibilityOffIconBlack;
    case 'cycle':
      return color === 'white' ? cycleIcon : cycleIconBlack;
    case 'stopCycle':
      return color === 'white' ? stopCycleIcon : stopCycleIconBlack;
    case 'dice':
      return color === 'white' ? diceIcon : diceIconBlack;
    case 'search':
      return color === 'white' ? searchIcon : searchIconBlack;
    case 'edit':
      return editIcon;
    case 'bomb':
      return color === 'white' ? bombIcon : bombIconBlack;
    case 'plus':
      return color === 'white' ? plusIcon : plusIconBlack;
    case 'more':
      return moreIcon;
    case 'warning':
      return warningIcon;
    case 'ruble':
      return rubleIcon;
    default:
      return '';
  }
}
